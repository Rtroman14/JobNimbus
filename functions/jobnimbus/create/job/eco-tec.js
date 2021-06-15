require("dotenv").config();

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const { baseID, recordID } = JSON.parse(event.body);

        // get airtable.contact
        const airtableContact = await Airtable.getContact(baseID, recordID);

        // check if contact is in jobnimbus
        // IMPORTANT - https://stackoverflow.com/questions/67994353/how-to-use-request-parameters-in-query-string-to-retrieve-jobnimbus-contacts

        // format airtable --> jobnimbus contact
        const jnContact = {
            // location: ,
            display_name: contact["Full Name"],
            first_name: contact["First Name"],
            last_name: contact["Last Name"],
            company: contact["Company Name"] || "",
            email: contact.Email || "",
            record_type_name: "Customer",
            status_name: "Active",
            mobile_phone: contact["Phone Number"] || "",
            address_line1: contact.Address || "",
            state_text: "IL",
            zip: contact.Address.split(" ").pop(),
        };

        // create contact in jobnimbus

        // create job in jobnimbus and assign contact to job

        // create note on job to notify stacy

        return {
            statusCode: 200,
            body: JSON.stringify({ res }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
