require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);
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
        let { jnid, sales_rep_name } = JSON.parse(event.body);
        let { client, body, recipient } = event.queryStringParameters;

        try {
            if (!recipient && !sales_rep_name) {
                throw new Error("No one to text");
            }

            const [account] = await Airtable.getAccount(client, "Account");
            const persons = await Airtable.getAccount(client, "Person");

            const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);
            const jnJob = await JobNimbus.getJob(jnid);

            if (jnJob === undefined || !jnJob) {
                throw new Error(`Coulnd't find job: ${jnid} for client: ${client}`);
            }

            const twilio = require("twilio")(
                account["Twilio Account SID"],
                account["Twilio Auth Token"]
            );

            if (recipient) {
                // if recipient === a specific deal field
                if (recipient in jnJob) {
                    recipient = jnJob[recipient];
                }

                recipient = persons.find(
                    (person) => person.Client === client && person.Name === recipient
                );
            } else {
                recipient = persons.find(
                    (person) => person.Client === client && person.Name === sales_rep_name
                );
            }

            body = Helper.queryStringVars(jnJob, body);

            const message = await twilio.messages.create({
                body,
                from: account["Phone Number"],
                to: recipient["Phone Number"],
            });

            console.log(`\nClient: ${client} \nText Message: ${body} \nTo: ${recipient.Name}`);

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
