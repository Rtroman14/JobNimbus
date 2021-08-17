require("dotenv").config();

const moment = require("moment");
var zipcode_to_timezone = require("zipcode-to-timezone");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

(async () => {
    let { client, body, recipient } = {
        client: "I Am Roofing",
        body: "Job: {{name}} has been sitting in stage: Pending Deposit for 3 days.",
        recipient: "Production Coordinator",
    };

    try {
        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((account) => account.Client === client);
        const persons = await Airtable.getAccounts("JobNimbus Accounts", "Persons");

        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);
        const jnJob = await JobNimbus.getJob("krgicquslvbe4cc54xmwqes");
        // const jnJob = await JobNimbus.getJob("kseq3x7326bq9utudmqi11z");

        // console.log(jnJob);

        body = Helper.queryStringVars(jnJob, body);

        console.log(body);
    } catch (error) {
        console.log(error);
    }
})();
