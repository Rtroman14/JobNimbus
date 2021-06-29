require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HighlevelApi = require("../src/api/Highlevel");

const JobNimbusApi = require("../src/api/JobNimbus");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);
        let { client, campaign } = event.queryStringParameters;

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
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
