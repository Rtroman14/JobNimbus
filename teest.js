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
    try {
        // const airtableDate = new Date("2021-07-23T08:00:00.000Z");
        // const dateGetTime = airtableDate.getTime();
        // console.log({ dateGetTime });

        // const targetDate = "1627045200";
        // console.log({ targetDate });

        const scheduledCallDate = new Date("2021-07-23T14:00:00.000Z"); // not GMT
        // const scheduledCallDate = new Date("2021-07-23T08:00:00.000Z"); // GMT

        const scheduledCallFormated = moment(scheduledCallDate).format("MMMM Do YYYY, h:mm a");

        console.log({ scheduledCallFormated });

        var timeZone = zipcode_to_timezone.lookup("80321");
        console.log({ timeZone });
    } catch (error) {
        console.log(error);
    }
})();
