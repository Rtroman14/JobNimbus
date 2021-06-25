require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const JobNimbusApi = require("./src/api/JobNimbus");

const res = {
    jnid: "kqcqjox0jnvec7lmopurn2r",
    type: "task",
    external_id: null,
    location: { id: 1 },
    created_by: "3vlshr",
    created_by_name: "Chris Pendergast",
    date_created: 1624649805,
    date_updated: 1624649805,
    owners: [
        {
            id: "3vlshr",
            email: "chrispendergast21@gmail.com",
            name: "Chris Pendergast",
        },
    ],
    date_start: 1624894200,
    date_end: 1624899600,
    tags: [],
    number: "1034",
    related: [
        {
            id: "kpe8u9zdn674jo88mxz05ib",
            name: "Ryan Roman",
            number: "1005",
            type: "job",
        },
    ],
    description: "this is a description",
    is_completed: false,
    title: "Installation Title",
    primary: null,
    record_type_name: "Installation",
    priority: 1,
    created_by_email: "chrispendergast21@gmail.com",
};

(async () => {
    // const res = JSON.parse(event.body);
    let { related } = res;
    let { client, campaign } = {
        client: "Eco Tec Foam And Coatings",
        campaign: "",
    };

    try {
        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((account) => account.Client === client);

        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

        // if related === job
        if (related.length && related[0].type === "job") {
            const jnJob = await JobNimbus.getJob(related[0].id);
            console.log(jnJob);
        }

        // console.log(`Client: ${client} \nText Message: ${body} \nTo: ${recipient.Name}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message }),
        };
    } catch (error) {
        // console.log(`Error: ${error.message} \nClient: ${client}`);

        return {
            statusCode: 500,
            body: JSON.stringify({ msg: error.message }),
        };
    }
})();
