require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const { makeHighlevelContact } = require("./src/helpers");

const zip = require("./src/api/zip");

(async () => {
    try {
        // const contact = await Airtable.getContact("appoNqmB15dMPPEXD", "rec3lbsoU9PyIp55V");
        // console.log(contact);
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
        // console.log(jnContact);
        // const newContact = await JobNimbus.createContact(jnContact);
        // console.log(newContact);
        // const res = await zip("54467");
        // let { city, state } = res;
        // city = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
        // console.log(city);
        // const jnContacts = await JobNimbus.contacts();
        // console.log(jnContacts);

        const { data } = await axios.get(
            "https://app.jobnimbus.com/api1/contacts?display_name=Kenny+Williams",
            {
                headers: {
                    Authorization: "bearer ",
                    "Content-Type": "application/json",
                },
            }
        );

        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
