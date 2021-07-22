require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

// (async () => {
//     try {
//         const { client, baseID, recordID } = {
//             recordID: "rece11fnBR87VhI9d",
//             baseID: "appjT6md6Csoncsjr",
//             client: "I Am Roofing",
//         };

//         let contact = await Airtable.getContact(baseID, recordID);

//         const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
//         const account = accounts.find((account) => account.Client === client);
//         const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

//         if ("Scheduled Call" in contact) {
//             const scheduledCallTime = new Date(contact["Scheduled Call"]);

//             // NOTE: related only uses the first instance
//             const newTask = {
//                 record_type_name: "New Lead",
//                 title: "New Lead - Follow Up",
//                 // description: `${jnContact.display_name} wishes to be contacted ${}`
//                 related: [{ id: "kqsm93gvga6ic8tab5p5ail" }], // contact - shows up under job
//                 date_start: scheduledCallTime.getTime(),
//                 date_end: scheduledCallTime.setHours(scheduledCallTime.getHours() + 1),
//                 // owners: [{ id: "35w4ow" }], // Logan Walston
//                 priority: 1,
//             };

//             const task = await JobNimbus.createTask(newTask);
//             console.log(task);
//         }
//     } catch (error) {
//         console.log(error);
//     }
// })();

(async () => {
    try {
        const { recordID, baseID, client } = {
            recordID: "rece11fnBR87VhI9d",
            baseID: "appjT6md6Csoncsjr",
            client: "I Am Roofing",
        };

        try {
            let contact = await Airtable.getContact(baseID, recordID);
            const { additionalContactFields, additionalJobFields, leadFollowUp } = clients(
                client,
                contact
            );

            if (!("Street" in contact)) {
                const address = await Helper.getAddress(contact.Address);
                contact = { ...contact, ...address };
            }

            const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
            const account = accounts.find((account) => account.Client === client);
            const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

            // create contact
            const baseContact = JobNimbus.baseContact(contact);
            const contactFields = { ...baseContact, ...additionalContactFields };
            const jnContact = await JobNimbus.createContact(contactFields);

            if (jnContact) {
                console.log("Created new contact:", jnContact.display_name);

                // create job
                const baseJob = JobNimbus.baseJob(jnContact);
                const jobFields = { ...baseJob, ...additionalJobFields };
                const jnJob = await JobNimbus.createJob(jobFields);

                if (jnJob) {
                    console.log("Created new job:", jnJob.name);

                    if ("Scheduled Call" in contact) {
                        const scheduledCall = new Date(contact["Scheduled Call"]);
                        const scheduledCallFormated =
                            moment(scheduledCall).format("MMMM Do YYYY, h:mm a");

                        // NOTE: related only uses the first instance
                        const newTask = {
                            record_type_name: "New Lead",
                            title: "New Lead - Follow Up",
                            description: `${jnContact.display_name} wishes to be contacted on ${scheduledCallFormated} MST`,
                            related: [{ id: jnContact.jnid }], // contact id - shows up under job
                            date_start: scheduledCall.getTime(),
                            date_end: scheduledCall.setHours(scheduledCall.getHours() + 1),
                            // owners: [{ id: leadFollowUp }],
                            priority: 1,
                        };

                        const task = await JobNimbus.createTask(newTask);
                        console.log("Created new contact:", task.title);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.log(error);
    }
})();
