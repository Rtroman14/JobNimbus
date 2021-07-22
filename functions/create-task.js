require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("../src/api/JobNimbus");

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

            const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
            const account = accounts.find((account) => account.Client === client);
            const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

            if ("Scheduled Call" in contact) {
                const scheduledCallDate = new Date(contact["Scheduled Call"]);
                const scheduledCallFormated =
                    moment(scheduledCallDate).format("MMMM Do YYYY, h:mm a");

                console.log({ scheduledCallDate });

                // NOTE: related only uses the first instance
                const newTask = {
                    record_type_name: "New Lead",
                    title: "New Lead - Follow Up",
                    description: `<Name> wishes to be contacted on ${scheduledCallFormated} MST`,
                    related: [{ id: "kqsm93gvga6ic8tab5p5ail" }], // contact id - shows up under job
                    date_start: scheduledCallDate.getTime(),
                    date_end: scheduledCallDate.setHours(scheduledCallDate.getHours() + 1),
                    // owners: [{ id: scheduledCall.salesRep }],
                    priority: 1,
                };

                const task = await JobNimbus.createTask(newTask);
                console.log("Created new contact:", task.title);
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ task }),
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
