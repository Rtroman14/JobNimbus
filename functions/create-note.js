require("dotenv").config();

const JobNimbusApi = require("../src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const clients = require("../src/clients");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        // IMPORTANT: owners === "Assigned To"
        // IMPORTANT: who to mention in note? sales_rep_name? all owners? one owner?
        const { jnid, sales_rep_name, owners } = JSON.parse(event.body);
        const { queryStringParameters } = event;

        // formate @mention --> returns an array
        let mentions = owners.length > 0 ? owners.map((owner) => owner.name) : [];
        sales_rep_name !== null && mentions.push(sales_rep_name);
        mentions = [...new Set(mentions)];
        mentions = mentions.map((mention) => mention.replace(" ", ""));

        if ("mention" in queryStringParameters) {
            // TODO: queryStringParameters key === "note" --> use value
            await JobNimbus.createNote(jnid, queryStringParameters.note);
        } else {
            // TODO: queryStringParameters key !== "note" --> @SalesRep || @AssignedTo
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ queryStringParameters }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};

const url = {
    client: "Eco Tec",
    note: "This is the note",
    mention: "Stacy Assistant",
};

const url2 = {
    client: "Eco Tec",
    note: "This is the note",
};
