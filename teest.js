require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HighlevelApi = require("./src/api/Highlevel");
// const Highlevel = new HighlevelApi(process.env.HIGHLEVEL_KEY);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const JobNimbusApi = require("./src/api/JobNimbus");

// const res = {
//     jnid: "kqgtzcr6k00e1vkhafuz9l",
//     type: "task",
//     external_id: null,
//     location: { id: 1 },
//     created_by: "3vlshr",
//     created_by_name: "Chris Pendergast",
//     date_created: 1624897439,
//     date_updated: 1624897439,
//     owners: [
//         {
//             id: "3vlshr",
//             email: "chrispendergast21@gmail.com",
//             name: "Chris Pendergast",
//         },
//     ],
//     date_start: 1624894200,
//     date_end: 1624896000,
//     tags: [],
//     number: "1036",
//     related: [
//         {
//             id: "3vm450",
//             name: "Ryan Roman",
//             number: "1004",
//             type: "contact",
//         },
//         {
//             id: "kpe8u9zdn674jo88mxz05ib",
//             name: "Ryan Roman",
//             number: "1005",
//             type: "job",
//         },
//     ],
//     description: "description",
//     is_completed: false,
//     title: "Installation",
//     primary: null,
//     record_type_name: "Installation",
//     priority: 1,
//     created_by_email: "chrispendergast21@gmail.com",
// };

const res = {
    jnid: "kpe8u9zdn674jo88mxz05ib",
    type: "job",
    external_id: null,
    number: "1005",
    created_by: "3vlshr",
    created_by_name: "Chris Pendergast",
    date_created: 1622564216,
    date_updated: 1624993473,
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
    date_status_change: 1624993473,
    description: null,
    address_line1: "11958 Ridge Parkway",
    address_line2: "Apt 209",
    city: "Broomfield",
    state_text: "CO",
    zip: "80021",
    country_name: "United States",
    record_type_name: "Roof Coatings",
    status_name: "Send Final Invoice",
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

            if (res.related.length) {
                for (let relatedSibling of res.related) {
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
                            `Client = ${client} \nCampaign = ${campaign} \nContact = ${jnContact.display_name}`
                        );

                        const createdNote = await JobNimbus.createNote(
                            job.jnid,
                            `Pushed ${jnContact.display_name} to '${campaign}' campaign`
                        );
                        console.log(`\nClient: ${client} \nNote: ${createdNote.note}`);
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
                            `Client = ${client} \nCampaign = ${campaign} \nContact = ${jnContact.display_name}`
                        );

                        const createdNote = await JobNimbus.createNote(
                            jnContact.jnid,
                            `Pushed ${jnContact.display_name} to '${campaign}' campaign`
                        );
                        console.log(`\nClient: ${client} \nNote: ${createdNote.note}`);
                    }
                }
            }
        }

        if (res.type === "job") {
            // get contacts res.related to job
            const jnJob = await JobNimbus.getJob(res.jnid);

            if (jnJob.primary) {
                // push contacts to highlevel
                const jnContact = await JobNimbus.getContact(jnJob.primary.id);
                const addedToCampaign = await Highlevel.jnToHlCampaign(
                    jnContact,
                    hlCampaign["Campaign ID"]
                );

                if (addedToCampaign) {
                    console.log(
                        `Client = ${client} \nCampaign = ${campaign} \nContact = ${jnContact.display_name}`
                    );

                    const createdNote = await JobNimbus.createNote(
                        res.jnid,
                        `Pushed ${jnContact.display_name} to '${campaign}' campaign`
                    );
                    console.log(`\nClient: ${client} \nNote: ${createdNote.note}`);
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "Pushed contact to HL campaign" }),
        };
    } catch (error) {
        console.log(`Error: ${error.message} \nClient: ${client}`);
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: error.message }),
        };
    }
})();
