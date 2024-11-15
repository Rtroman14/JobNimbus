require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("../src/api/JobNimbus");
const HelperApi = require("../src/Helper");
const Helper = new HelperApi();

const clients = require("../src/clients");
const slackNotification = require("../src/slackNotification");
const slackNoti = require("../src/slackNoti");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const { recordID, baseID, client, scheduledCall } = JSON.parse(event.body);

        let contact = await Airtable.getContact(baseID, "Prospects", recordID);
        const { additionalContactFields } = clients(client, contact);

        if (!("Street" in contact)) {
            const address = await Helper.getAddress(contact.Address);
            contact = { ...contact, ...address };
        }

        const [account] = await Airtable.getAccount(client, "Account");
        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

        // contact fields
        const baseContact = JobNimbus.baseContact(contact);
        const contactFields = { ...baseContact, ...additionalContactFields };

        const jnContact = await JobNimbus.createContact(contactFields);

        if (jnContact) {
            console.log("Created new contact:", jnContact.display_name);

            await JobNimbus.createNote(jnContact.jnid, `Response: ${contact.Response} (Peakleads)`);

            if ("Notes" in contact) {
                await JobNimbus.createNote(jnContact.jnid, `${contact.Notes} (Peakleads)`);
            }

            if ("Scheduled Call" in contact) {
                const scheduledCallDate = new Date(contact["Scheduled Call"]);

                // NOTE: MUST dissable GMT in Airtable
                // NOTE: related only uses the first instance
                const newTask = {
                    record_type_name: "New Lead",
                    title: "New Lead - Follow Up",
                    description: `${jnContact.display_name} wishes to be contacted on the date/time provided.`,
                    related: [{ id: jnContact.jnid }], // contact id - shows up under job
                    date_start: scheduledCallDate.getTime(),
                    date_end: scheduledCallDate.setHours(scheduledCallDate.getHours() + 1),
                    owners: [{ id: scheduledCall?.salesRep || "" }],
                    priority: 1,
                };

                const task = await JobNimbus.createTask(newTask);
                console.log("Created new task:", task.title);
            }

            // * notify LJ of created contact
            await slackNoti(
                `${client}'s JobNimbus`,
                `${jnContact.display_name} was added to ${client}'s JobNimbus`,
                "U035NKFJJ56"
            );
        } else {
            await slackNotification(
                `There was an error when creating a contact for client: *${client}*`,
                "Error creating contact in Jobnimbus"
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ jnContact }),
        };
    } else {
        console.error("create-contact.js -->", error);
        await slackNotification(
            `There was an error when creating a contact https://app.netlify.com/sites/jobnimbus/functions/create-contact`,
            "Error creating contact in Jobnimbus"
        );

        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
