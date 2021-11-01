require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
// const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

(async () => {
    try {
        const client = "All Area Roofing";

        const [account] = await Airtable.getAccount(client, "Account");
        const persons = await Airtable.getAccount(client, "Person");

        console.log(account);
        console.log(persons);

        const twilio = require("twilio")(
            account["Twilio Account SID"],
            account["Twilio Auth Token"]
        );

        const message = await twilio.messages.create({
            body: "This is a test",
            from: account["Phone Number"],
            to,
        });

        console.log(message);
    } catch (error) {
        console.log(error);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
