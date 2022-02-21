require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HighlevelApi = require("../src/api/Highlevel");

const JobNimbusApi = require("../src/api/JobNimbus");

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
        let { client } = event.queryStringParameters;

        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((record) => record.Client === client);

        const Highlevel = new HighlevelApi(account["HighLevel API Key"]);

        let jnContact = res;

        try {
            if (res.type === "job") {
                const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

                const jnJob = await JobNimbus.getJob(res.jnid);

                if (jnJob.primary) {
                    jnContact = await JobNimbus.getContact(jnJob.primary.id);
                }
            }

            const hlContact = Helper.makeHighlevelContact(jnContact);
            const foundContact = await Highlevel.searchContact(hlContact.email, hlContact.phone);

            if (foundContact) {
                const updatedContact = await Highlevel.updateContact(foundContact.id, {
                    ...foundContact,
                    dnd: true,
                });

                if (updatedContact) {
                    console.log(`\nClient: ${client} \nDND: ${updatedContact.fullNameLowerCase}`);
                }
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ msg: "Set contact to DND" }),
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
            body: JSON.stringify({ msg: error.message }),
        };
    }
};
