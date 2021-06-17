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

        const contact = await Airtable.getContact(baseID, recordID);

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

        return {
            statusCode: 200,
            body: JSON.stringify({ contact }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
