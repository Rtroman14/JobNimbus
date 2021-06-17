require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

(async () => {
    try {
        let airtableContact = await Airtable.getContact("appoNqmB15dMPPEXD", "rec3lbsoU9PyIp55V");
        console.log(airtableContact);

        // format airtable --> jobnimbus contact
        if ("Street" in airtableContact) {
            console.log("TRUEEE");
        } else {
            console.log("FALSEEE");
            const address = await Helper.getAddress(airtableContact.Address);
            airtableContact = { ...airtableContact, ...address };
        }

        console.log(airtableContact);

        // const jnContact = {
        //     // location: ,
        //     display_name: contact["Full Name"],
        //     first_name: contact["First Name"],
        //     last_name: contact["Last Name"],
        //     company: contact["Company Name"] || "",
        //     email: contact.Email || "",
        //     record_type_name: "Customer",
        //     status_name: "Active",
        //     mobile_phone: contact["Phone Number"] || "",
        //     address_line1: contact.Address || "",
        //     state_text: "IL",
        //     zip: contact.Address.split(" ").pop(),
        // };
    } catch (error) {
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
