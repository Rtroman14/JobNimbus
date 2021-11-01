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

        let contact = await Airtable.getContact(baseID, recordID);
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
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ jnContact }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
