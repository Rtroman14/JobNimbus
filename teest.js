require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const res = {
    jnid: "kpe8u9zdn674jo88mxz05ib",
    type: "job",
    external_id: null,
    number: "1005",
    created_by: "3vlshr",
    created_by_name: "Chris Pendergast",
    date_created: 1622564216,
    date_updated: 1624577251,
    location: { id: 1 },
    owners: [],
    date_start: 0,
    date_end: 0,
    tags: [],
    related: [
        {
            id: "3vm450",
            name: "Ryan Roman",
            number: "1004",
            type: "contact",
        },
        {
            id: "3vlsil",
            name: "Jane Tester",
            number: "1002",
            type: "contact",
        },
    ],
    sales_rep: "kpwrz7poastl1hfqz2o6yix",
    sales_rep_name: "Ryan Roman",
    date_status_change: 1624577251,
    description: null,
    address_line1: "11958 Ridge Parkway",
    address_line2: "Apt 209",
    city: "Broomfield",
    state_text: "CO",
    zip: "80021",
    country_name: "United States",
    record_type_name: "Roof Coatings",
    status_name: "Proposal Pending",
    source_name: "Summa Media - SEO",
    primary: { id: "3vm450", name: "Ryan Roman", number: "1004", type: "contact" },
    name: "Ryan Roman",
    parent_home_phone: "7152525716",
    parent_mobile_phone: "",
    parent_work_phone: "",
    parent_fax_number: "",
    sales_rep_email: "Rtroman14@gmail.com",
    created_by_email: "chrispendergast21@gmail.com",
};

(async () => {
    let { jnid, sales_rep_name, type, related } = res;
    let { client, body, recipient } = {
        client: "Eco Tec Foam And Coatings",
        // mention: "",
        body: "Check the status of the proposal for job: {{name}}. https://app.jobnimbus.com/job/{{jnid}}",
    };

    try {
        if (!recipient && !sales_rep_name) {
            throw new Error("No one to text");
        }

        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((account) => account.Client === client);
        const persons = await Airtable.getAccounts("JobNimbus Accounts", "Persons");

        const twilio = require("twilio")(
            account["Twilio Account SID"],
            account["Twilio Auth Token"]
        );

        if (recipient) {
            recipient = persons.find(
                (person) => person.Client === client && person.Name === recipient
            );
        } else {
            recipient = persons.find(
                (person) => person.Client === client && person.Name === sales_rep_name
            );
        }

        console.log({ recipient });

        body = Helper.queryStringVars(res, body);

        const message = await twilio.messages.create({
            body,
            from: account["Phone Number"],
            to: recipient["Phone Number"],
        });

        console.log(`Client: ${client} \nText Message: ${body} \nTo: ${recipient}`);
    } catch (error) {
        console.log(error);
        console.log(`Error: ${error.message} \nClient: ${client}`);
    }
})();
