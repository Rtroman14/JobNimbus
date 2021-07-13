require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

(async () => {
    const { recordID, baseID, client } = {
        recordID: "recjZSxR76JUDrNLW",
        baseID: "appjT6md6Csoncsjr",
        client: "I Am Roofing",
    };

    try {
        let contact = await Airtable.getContact(baseID, recordID);
        const { additionalContactFields, additionalJobFields } = clients(client, contact);

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

                // NOTE: CREATE NOTE WITHIN JOBNIMBUS TO SEPARATE AUTOMATIONS
                // create note
                // const note = await JobNimbus.createNote(jnJob.jnid, notes.addLead);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
