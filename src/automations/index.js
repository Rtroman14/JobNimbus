require("dotenv").config({ path: "../../.env" });

const AirtableApi = require("../api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const HelpersApi = require("../api/Helpers");
const Helpers = new HelpersApi();

const client = "Roper Roofing";
const baseID = "appr7rcKd3W6oMdiC";

(async () => {
    const jobNimbusURL = "https://jobnimbus.netlify.app/.netlify/functions";
    const textJobLink = "%20Link%20-%20https://app.jobnimbus.com/job/{{jnid}}";

    const textURL = jobNimbusURL + "/send-text?client=" + Helpers.makeQuery(client);
    const noteURL = jobNimbusURL + "/create-note?client=" + Helpers.makeQuery(client);
    const highlevelURL = jobNimbusURL + "/highlevel?client=" + Helpers.makeQuery(client);

    try {
        const automations = await Airtable.getAutomations("CRM - Automations", baseID);

        for (let automation of automations) {
            let updatedFields;

            const receiver =
                automation.Receiver in automation
                    ? `&${Helpers.makeQuery(automation.Receiver)}`
                    : "";

            if (automation.Outreach === "Both") {
                const message = Helpers.makeQuery(automation.Body);

                const noteWebhook = `${noteURL}&note=${message}${receiver}`;

                const textWebhook = `${textURL}&body=${message}${textJobLink}${receiver}`;

                updatedFields = {
                    "Webhook - Text": textWebhook,
                    "Webhook - Note": noteWebhook,
                };
            }

            if (automation.Outreach === "Highlevel") {
                const campaign = Helpers.makeQuery(automation.Receiver);

                const highlevelWebhook = `${highlevelURL}&campaign=${campaign}`;

                updatedFields = { ...updatedFields, "Webhook - Highlevel": highlevelWebhook };
            }

            await Airtable.updateContact(baseID, automation.recordID, updatedFields);

            await Helpers.minutesWait(0.005);
        }
    } catch (error) {
        console.log(error.message);
    }
})();
