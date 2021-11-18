require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const { recordID, baseID } = JSON.parse(event.body);

        const contact = await Airtable.getContact(baseID, "Prospects", recordID);

        // push contact to jobnimbus

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
