require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API);

(async () => {
    try {
        const contact = await Airtable.getContact("appoNqmB15dMPPEXD", "rec0LXC2e3sGQwprk");

        console.log(contact);

        const jnContact = {
            // location: ,
            display_name: contact["Full Name"],
            first_name: contact["First Name"],
            last_name: contact["Last Name"],
            company: contact["Company Name"] || "",
            email: contact.Email || "",
            record_type_name: "Customer",
            status_name: "Lead",
            mobile_phone: contact["Phone Number"] || "",
            address_line1: contact.Address || "",
        };
    } catch (error) {
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
