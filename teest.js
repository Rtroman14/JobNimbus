require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HighlevelApi = require("./src/api/Highlevel");
const Highlevel = new HighlevelApi(process.env.HIGHLEVEL_KEY);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const JobNimbusApi = require("./src/api/JobNimbus");

const res = {
    jnid: "kqgtzcr6k00e1vkhafuz9l",
    type: "task",
    external_id: null,
    location: { id: 1 },
    created_by: "3vlshr",
    created_by_name: "Chris Pendergast",
    date_created: 1624897439,
    date_updated: 1624897439,
    owners: [
        {
            id: "3vlshr",
            email: "chrispendergast21@gmail.com",
            name: "Chris Pendergast",
        },
    ],
    date_start: 1624894200,
    date_end: 1624896000,
    tags: [],
    number: "1036",
    related: [
        {
            id: "3vm450",
            name: "Ryan Roman",
            number: "1004",
            type: "contact",
        },
        {
            id: "kpe8u9zdn674jo88mxz05ib",
            name: "Ryan Roman",
            number: "1005",
            type: "job",
        },
    ],
    description: "description",
    is_completed: false,
    title: "Installation",
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
        campaign: "Test Emails",
    };

    try {
        const accounts = await Airtable.getAccounts("JobNimbus Accounts", "Accounts");
        const account = accounts.find((record) => record.Client === client);
        const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

        const campaigns = await Airtable.getAccounts("Campaigns", "CRM");
        const hlCampaign = campaigns.find((record) => record.Campaign === campaign);
        const Highlevel = new HighlevelApi(hlCampaign["API Token"]);

        if (res.type === "task") {
            let job = {
                jnid: false,
            };
            let contacts = [];

            if (related.length) {
                for (let relatedSibling of related) {
                    if (relatedSibling.type === "job") {
                        job.jnid = relatedSibling.id;
                    }
                    if (relatedSibling.type === "contact") {
                        contacts.push(relatedSibling);
                    }
                }
            }

            if (job.jnid) {
                // get contacts related to job
                const jnJob = await JobNimbus.getJob(job.jnid);

                if (jnJob.primary) {
                    // push contacts to highlevel
                    const jnContact = await JobNimbus.getContact(jnJob.primary.id);
                    const addedToCampaign = await Highlevel.jnToHlCampaign(
                        jnContact,
                        hlCampaign["Campaign ID"]
                    );

                    if (addedToCampaign) {
                        console.log(
                            `Client = ${client} \nHighlevel Campaign = ${campaign} \nContact = ${highlevelContact.name}`
                        );
                    }
                }
            }

            if (!job.jnid && contacts.length) {
                for (let contact of contacts) {
                    const jnContact = await JobNimbus.getContact(contact.id);
                    const addedToCampaign = await Highlevel.jnToHlCampaign(
                        jnContact,
                        hlCampaign["Campaign ID"]
                    );

                    if (addedToCampaign) {
                        console.log(
                            `Client = ${client} \nHighlevel Campaign = ${campaign} \nContact = ${highlevelContact.name}`
                        );
                    }
                }
            }
        }

        // return {
        //     statusCode: 200,
        //     body: JSON.stringify({ message }),
        // };
    } catch (error) {
        console.log(error);
        // console.log(`Error: ${error.message} \nClient: ${client}`);
        // return {
        //     statusCode: 500,
        //     body: JSON.stringify({ msg: error.message }),
        // };
    }
})();
