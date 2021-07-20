require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

(async () => {
    const { recordID, baseID, client } = {
        recordID: "recjZSxR76JUDrNLW",
        baseID: "appjT6md6Csoncsjr",
        client: "I Am Roofing",
    };

    try {
        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((account) => account.Client === client);
        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

        const job = await JobNimbus.getJob("kqh5hph21ib24zntaywx2fi");
        console.log(job);
    } catch (error) {
        console.log(error);
    }
})();
