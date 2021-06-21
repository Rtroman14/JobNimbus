require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("../src/api/JobNimbus");

const clients = require("../src/clients");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        // NOTE: owners === "Assigned To"
        const { jnid, sales_rep_name } = JSON.parse(event.body);
        let { client, mention, note } = event.queryStringParameters;

        // TODO: get client's Airtable API key
        const campaigns = await Airtable.getCampaigns("JobNimbus Accounts", "Accounts");
        const campaign = campaigns.find((campaign) => campaign.Client === client);

        const JobNimbus = new JobNimbusApi(campaign["JobNimbus API Key"]);

        if (mention) {
            mention = `@${mention.replace(" ", "")}`;
        } else {
            mention = `@${sales_rep_name.replace(" ", "")}`;
        }

        const note = await JobNimbus.createNote(jnid, `${mention} ${note}`);
        console.log(note);

        return {
            statusCode: 200,
            body: JSON.stringify({ queryStringParameters: event.queryStringParameters }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
