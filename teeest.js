require("dotenv").config();

const moment = require("moment");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

(async () => {
    try {
        const { recordID, baseID, client } = {
            recordID: "rece11fnBR87VhI9d",
            baseID: "appjT6md6Csoncsjr",
            client: "I Am Roofing",
        };

        let contact = await Airtable.getContact(baseID, recordID);

        const date = new Date(contact["Scheduled Call"]);

        const formatedDate = moment(date).format("MMMM Do YYYY, h:mm a");

        console.log(formatedDate);
    } catch (error) {
        console.log(error);
    }
})();
