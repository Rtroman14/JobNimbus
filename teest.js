require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

(async (event) => {
    const { recordID, baseID, client } = {
        recordID: "recWnl3K3Fg2FfXzK",
        baseID: "appjT6md6Csoncsjr",
        client: "I Am Roofing",
    };

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

        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((account) => account.Client === client);
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
                    const scheduledCallFormated =
                        moment(scheduledCallDate).format("MMMM Do YYYY, h:mm a");

                    // NOTE: related only uses the first instance
                    const newTask = {
                        record_type_name: "New Lead",
                        title: "New Lead - Follow Up",
                        description: `${jnContact.display_name} wishes to be contacted on ${scheduledCallFormated} MST`,
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
    } catch (error) {
        console.log(error);
    }
})();
// ALL JOB STATUS === LEAD --> IT SHOULD BE STATUS === LEAD FOLLOW UP IF CALL SCHEDULED IN CONTACT
