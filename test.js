require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

(async () => {
    try {
        const client = "eco-tec";

        let contact = await Airtable.getContact("appoNqmB15dMPPEXD", "rec3lbsoU9PyIp55V");

        if (!("Street" in contact)) {
            const address = await Helper.getAddress(contact.Address);
            contact = { ...contact, ...address };
        }

        // create contact
        const baseContact = JobNimbus.baseContact(contact);
        const { additionalContactFields } = clients(client, contact);
        const contactFields = { ...baseContact, ...additionalContactFields };
        const jnContact = await JobNimbus.createContact(contactFields);
        console.log("Created new contact: ", jnContact.jnid);

        // create job
        const baseJob = JobNimbus.baseJob(jnContact);
        const { additionalJobFields } = clients(client);
        const jobFields = { ...baseJob, ...additionalJobFields };
        const jnJob = await JobNimbus.createJob(jobFields);
        console.log(jnJob);

        // create note
        // const assistant = clients(client, contact);
        const note = await JobNimbus.createNote(
            jnJob.jnid,
            "@RyanRoman New lead! Please see description."
        );
    } catch (error) {
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
