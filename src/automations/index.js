require("dotenv").config({ path: "../../.env" });

const AirtableApi = require("../api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const client = "Roper Roofing";

const textURL = "https://jobnimbus.netlify.app/.netlify/functions/send-text?client=";
const noteURL = "https://jobnimbus.netlify.app/.netlify/functions/create-note?client=";
const highlevelURL = "https://jobnimbus.netlify.app/.netlify/functions/highlevel?client=";

const textJobLink = "%20Link%20-%20https://app.jobnimbus.com/job/{{jnid}}";

const baseID = "appr7rcKd3W6oMdiC";

(async () => {
    try {
        const automations = await Airtable.getAutomations("CRM - Automations", baseID);

        for (let automation of automations) {
            const receiver =
                automation.Receiver in automation ? `&${makeQuery(automation.Receiver)}` : "";

            if (automation.Outreach === "Both") {
                const noteWebhook = noteURL + makeQuery(automation.Body) + receiver;
                const textWebhook = textURL + makeQuery(automation.Body) + textJobLink + receiver;

                const updatedFields = {
                    "Webhook - Text": textWebhook,
                    "Webhook - Note": noteWebhook,
                };
            }

            if (automation.Outreach === "Highlevel") {
                const highlevelWebhook = highlevelURL + receiver;
            }

            await Airtable.updateContact(baseID, automation.recordID, updatedFields);
        }
    } catch (error) {
        console.log(error.message);
    }
})();

// {
//     Name: 'RP/CP_Building Inspector - Email & Text',
//     Stage: 'Building Inspector',
//     Board: [ 'Residential Production', 'Commercial Production' ],
//     Outreach: 'Both',
//     Body: 'Job: {{name}} needs a building inspector.',
//     'Recipient/Mention/Campaign': 'Esther Melanson',
//     recordID: 'recgjrx8OsFVg4j7y'
// }

const makeQuery = (string) => string.replace(/\ /g, "%20");
