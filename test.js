require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const twilio = require("twilio")(accountSid, authToken);

(async () => {
    try {
        let { client, campaign } = { client: "I Am Roofing", campaign: "Day Before Install" };

        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((record) => record.Client === client);
        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

        const campaigns = await Airtable.getAccounts("Campaigns", "CRM");
        const hlCampaign = campaigns.find(
            (record) => record.Campaign === campaign && record.Client === client
        );
        // const Highlevel = new HighlevelApi(hlCampaign["API Token"]);

        console.log(hlCampaign);
    } catch (error) {
        console.log("Catch");
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
