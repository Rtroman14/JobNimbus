require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("../src/api/JobNimbus");

const HelperApi = require("../src/Helper");
const Helper = new HelperApi();

const clients = require("../src/clients");

// IMPORTANT: must have "client" and "note" query params. "mention" is optional
exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        // NOTE: owners === "Assigned To"
        let res = JSON.parse(event.body);
        let { jnid, sales_rep_name, type, related } = JSON.parse(event.body);
        let { client, mention, note } = event.queryStringParameters;

        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((account) => account.Client === client);

        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

        if (type === "task") {
            if (related.length > 0) {
                jnid = related[0].id;
            }
        }

        if (mention) {
            if (mention.includes(",")) {
                mention = mention
                    .split(",")
                    .map((person) => `@${person.trim().replace(" ", "")}`)
                    .join(" ");
            } else {
                mention = `@${mention.replace(" ", "")}`;
            }
        } else {
            mention = `@${sales_rep_name.replace(" ", "")}` || "";
        }

        note = Helper.queryStringVars(res, note);

        const createdNote = await JobNimbus.createNote(jnid, `${mention} ${note}`);
        const message = `\nClient: ${client} \nNote: ${createdNote.note}`;
        console.log(message);

        return {
            statusCode: 200,
            body: JSON.stringify({ message }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
