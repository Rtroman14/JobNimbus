require("dotenv").config();

const moment = require("moment");
const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HighlevelApi = require("./src/api/Highlevel");

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

const res = {
    jnid: "kzwwaessfr7qht8z4u3bggj",
    type: "contact",
    external_id: null,
    number: "22-1275",
    created_by: "38t41a",
    created_by_name: "Tony Jackson",
    date_created: 1645459814,
    date_updated: 1645459823,
    location: {
        id: 1,
    },
    owners: [],
    date_start: 0,
    date_end: 0,
    tags: [],
    related: [],
    sales_rep: "38t41a",
    sales_rep_name: "Tony Jackson",
    date_status_change: 1645459823,
    description: null,
    address_line1: "220 Summit Blvd",
    address_line2: "",
    city: "Broomfield",
    state_text: "CO",
    zip: "80021",
    country_name: "United States",
    record_type_name: "Insurance",
    status_name: "Lead Follow Up",
    source_name: null,
    first_name: "Ryan",
    last_name: "Roman",
    company: "Summa",
    display_name: "Roman, Ryan",
    email: "ryan@summamedia.co",
    home_phone: "",
    mobile_phone: "7152525716",
    work_phone: "",
    fax_number: "",
    website: null,
    sales_rep_email: "tonyjackson.exp@gmail.com",
    created_by_email: "tonyjackson.exp@gmail.com",
};

(async () => {
    // const res = JSON.parse(event.body);
    let { client } = { client: "EXP Contractors" };

    const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
    const account = accounts.find((record) => record.Client === client);

    const Highlevel = new HighlevelApi(account["HighLevel API Key"]);

    let jnContact = res;

    try {
        if (res.type === "job") {
            const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

            const jnJob = await JobNimbus.getJob(res.jnid);

            if (jnJob.primary) {
                jnContact = await JobNimbus.getContact(jnJob.primary.id);
            }
        }

        const hlContact = Helper.makeHighlevelContact(jnContact);
        const foundContact = await Highlevel.searchContact(hlContact.email, hlContact.phone);

        if (foundContact) {
            const updatedContact = await Highlevel.updateContact(foundContact.id, {
                ...foundContact,
                dnd: true,
            });

            if (updatedContact) {
                console.log(`\nClient: ${client} \nDND: ${updatedContact.fullNameLowerCase}`);
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
