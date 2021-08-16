require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
// const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const res = {
    jnid: "krmbu8heiqv3hfxhccywmgn",
    type: "job",
    external_id: null,
    number: "1399",
    created_by: "35wke9",
    created_by_name: "Alec Martin",
    date_created: 1627406547,
    date_updated: 1629138513,
    location: {
        id: 1,
    },
    owners: [],
    date_start: 0,
    date_end: 0,
    tags: [],
    related: [],
    sales_rep: null,
    sales_rep_name: null,
    date_status_change: 1629138513,
    description: null,
    address_line1: "220 Summit Blvd",
    address_line2: "22-242",
    city: "Broomfield",
    state_text: "CO",
    zip: "80021",
    country_name: "United States",
    record_type_name: "Residential Replacement",
    status_name: "Paid Sub",
    source_name: null,
    primary: null,
    name: "Summa Test",
    parent_home_phone: "",
    parent_mobile_phone: "",
    parent_work_phone: "",
    parent_fax_number: "",
    created_by_email: "alec@iamroofing.com",
};

(async () => {
    try {
        let { sales_rep_name, jnid } = res;
        let { client, body, recipient } = {
            client: "I Am Roofing",
            body: "This is a body",
            recipient: "Production Coordinator",
        };

        if (!recipient && !sales_rep_name) {
            throw new Error("No one to text");
        }

        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((account) => account.Client === client);
        const persons = await Airtable.getAccounts("JobNimbus Accounts", "Persons");

        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);
        const jnJob = await JobNimbus.getJob(jnid);

        if (recipient) {
            // if recipient === a specific deal field
            if (recipient in jnJob) {
                recipient = jnJob[recipient];
            }

            recipient = persons.find(
                (person) => person.Client === client && person.Name === recipient
            );
        } else {
            recipient = persons.find(
                (person) => person.Client === client && person.Name === sales_rep_name
            );
        }

        body = Helper.queryStringVars(jnJob, body);
        console.log(recipient);
    } catch (error) {
        console.log("Catch");
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
