require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("../src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

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
        const { recordID, baseID } = JSON.parse(event.body);
        const { client } = event.queryStringParameters;

        let contact = await Airtable.getContact(baseID, recordID);

        if (!("Street" in contact)) {
            const address = await Helper.getAddress(contact.Address);
            contact = { ...contact, ...address };
        }

        // create contact
        const baseContact = JobNimbus.baseContact(contact);
        const { additionalContactFields } = clients(client, contact);
        const contactFields = { ...baseContact, ...additionalContactFields };
        const jnContact = await JobNimbus.createContact(contactFields);
        console.log("\nCreated new contact:", jnContact.display_name);

        // create job
        const baseJob = JobNimbus.baseJob(jnContact);
        const { additionalJobFields } = clients(client);
        const jobFields = { ...baseJob, ...additionalJobFields };
        const jnJob = await JobNimbus.createJob(jobFields);
        console.log("Created new job:", jnJob.name);

        // create note
        // const assistant = clients(client, contact);
        const note = await JobNimbus.createNote(
            jnJob.jnid,
            "@RyanRoman New lead! Please see description."
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ jnJob }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
