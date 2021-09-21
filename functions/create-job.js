require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("../src/api/JobNimbus");

const HelperApi = require("../src/Helper");
const Helper = new HelperApi();

const clients = require("../src/clients");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const { recordID, baseID, client } = JSON.parse(event.body);

        try {
            let contact = await Airtable.getContact(baseID, recordID);
            const { additionalContactFields, additionalJobFields, scheduledCall } = clients(
                client,
                contact
            );

            if (!("Street" in contact)) {
                const address = await Helper.getAddress(contact.Address);
                contact = { ...contact, ...address };
            }

            const account = await Airtable.getAccount(client);
            const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

            // contact fields
            const baseContact = JobNimbus.baseContact(contact);
            const contactFields = { ...baseContact, ...additionalContactFields };

            const jnContact = await JobNimbus.createContact(contactFields);

            if (jnContact) {
                console.log("Created new contact:", jnContact.display_name);

                // job fields
                const baseJob = JobNimbus.baseJob(jnContact);
                let jobFields = { ...baseJob, ...additionalJobFields };

                if ("Scheduled Call" in contact) {
                    jobFields = { ...jobFields, status_name: scheduledCall.jobStatusName };
                }

                const jnJob = await JobNimbus.createJob(jobFields);

                if (jnJob) {
                    console.log("Created new job:", jnJob.name);

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
                            owners: [{ id: scheduledCall.salesRep }],
                            priority: 1,
                        };

                        const task = await JobNimbus.createTask(newTask);
                        console.log("Created new contact:", task.title);
                    }
                }
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ jnJob }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ msg: "Error" }),
            };
        }
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
