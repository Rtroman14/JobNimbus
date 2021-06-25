require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HelperApi = require("../src/Helper");
const Helper = new HelperApi();

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);
        let { sales_rep_name } = JSON.parse(event.body);
        let { client, campaign } = event.queryStringParameters;

        try {
            // if task --> get job
            //

            console.log(`Client: ${client} \nText Message: ${body} \nTo: ${recipient.Name}`);

            return {
                statusCode: 200,
                body: JSON.stringify({ message }),
            };
        } catch (error) {
            console.log(`Error: ${error.message} \nClient: ${client}`);

            return {
                statusCode: 500,
                body: JSON.stringify({ msg: error.message }),
            };
        }
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
