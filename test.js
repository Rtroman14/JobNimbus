require("dotenv").config();

const axios = require("axios");

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const clients = require("./src/clients");

(async () => {
    try {
        const { jnid, sales_rep_name, owners } = {
            jnid: "123",
            // sales_rep_name: null,
            sales_rep_name: "Ryan Roman",
            owners: [
                {
                    id: "3vlshr",
                    email: "chrispendergast21@gmail.com",
                    name: "Chris Pendergast",
                },
                {
                    id: "kpwrz7poastl1hfqz2o6yix",
                    email: "Rtroman14@gmail.com",
                    name: "Ryan Roman",
                },
            ],
            // owners: [],
        };

        // formate @mention
        let mentions = owners.length > 0 ? owners.map((owner) => owner.name) : [];
        sales_rep_name !== null && mentions.push(sales_rep_name);
        mentions = [...new Set(mentions)];
        mentions = mentions
            .unshift("@")
            .map((mention) => mention.replace(" ", ""))
            .join(" @");

        console.log(mentions);
    } catch (error) {
        console.log(error.message);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
