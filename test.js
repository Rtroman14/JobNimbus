require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const twilio = require("twilio")(accountSid, authToken);

(async () => {
    try {
        const message = await twilio.messages.create({
            body: "Hello world",
            from: "+13127790387",
            to: "7152525716",
        });
        console.log(message);
        // ------------------------------------------ //
        // let sales_rep_name = "Stacy lastName";
        // let { client, body, recipient } = {
        //     client: "Eco Tec Foam And Coatings",
        //     body: "This is message body",
        //     // recipient: "Stacy lastName",
        //     // recipient: null,
        // };
        // if (!recipient && !sales_rep_name) {
        //     throw new Error("No one to text");
        // }
        // const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        // const account = accounts.find((account) => account.Client === client);
        // const persons = await Airtable.getAccounts("JobNimbus Accounts", "Persons");
        // if (recipient) {
        //     recipient = persons.find(
        //         (person) => person.Client === client && person.Name === recipient
        //     );
        // } else {
        //     recipient = persons.find(
        //         (person) => person.Client === client && person.Name === sales_rep_name
        //     );
        // }
        // const message = {
        //     body,
        //     from: account["Phone Number"],
        //     to: recipient["Phone Number"],
        // };
        // console.log(message);
    } catch (error) {
        console.log("Catch");
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
