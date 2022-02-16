require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

(async () => {
    const { recordID, baseID, client } = {
        recordID: "reckjbUEXy40QfZlt",
        baseID: "app887rsD9oKqWpSA",
        client: "EXP Contractors",
    };

    try {
        let contact = await Airtable.getContact(baseID, "JobNimbus Contact Form", recordID);

        console.log(contact);
    } catch (error) {
        console.log(error);
    }
})();
