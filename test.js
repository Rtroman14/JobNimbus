require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;

// const twilio = require("twilio")(accountSid, authToken);

(async () => {
    try {
        // const message = await twilio.messages.create({
        //     body: "Hello world",
        //     from: "+13343262574",
        //     to: "+17152525716",
        // });
        // console.log(message);
        // ------------------------------------------ //
        // ------------------------------------------ //
        // const contact = {
        //     firstName: "Ryan",
        //     lastName: "Roman",
        //     name: "Ryan Roman",
        //     email: "ryan@summamedia.co",
        //     phone: "7152525716",
        //     address1: "11958 Ridge Parkway Apt 209",
        //     city: "Broomfield",
        //     state: "CO",
        //     postalCode: "80021",
        // };
        // const highlevelContact = await Highlevel.createContact(contact);
        // console.log(highlevelContact);
        // ------------------------------------------ //
    } catch (error) {
        console.log("Catch");
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
