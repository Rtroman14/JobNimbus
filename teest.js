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
    const { recordID, baseID, client } = {
        recordID: "recXzrkUR0v29snZi",
        baseID: "appjT6md6Csoncsjr",
        client: "I Am Roofing",
    };

    try {
        let contact = await Airtable.getContact(baseID, "Prospects", recordID);
        // delete contact.Zip;
        let foundContact = clients(client, contact);

        console.log(foundContact.additionalJobFields.sales_rep_name);
    } catch (error) {
        console.log(error);
    }
})();
