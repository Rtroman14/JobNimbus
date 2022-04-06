require("dotenv").config();

const AirtableApi = require("./src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi("l16twhzwgho855k2");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

const toCapitalize = (string) => {
    return string
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(" ");
};

const baseID = "appCQqxgfJNVhy5WE";
const table = "Old CRM";

(async () => {
    try {
        const jnContacts = await JobNimbus.getAllContacts();

        const contacts = await Airtable.getContacts(baseID, table, "Grid view");

        for (let contact of contacts) {
            const foundJnContact = jnContacts.results.find(
                (jnContact) =>
                    jnContact.display_name.toLowerCase() === contact["JOB NAME"].toLowerCase()
            );

            if (foundJnContact) {
                let name = toCapitalize(contact.STREET.toLowerCase());

                if ("AREA OF BUILDING COVERED" in contact) {
                    name = `${name} - ${toCapitalize(
                        contact["AREA OF BUILDING COVERED"].toLowerCase()
                    )} (2)`;
                } else {
                    name = `${name} (2)`;
                }

                let type = "Commercial";

                if (contact["JOB NAME"].includes("RESIDENCE")) {
                    type = "Residential";
                }

                const jnJob = await JobNimbus.createJob({
                    name,
                    record_type_name: type,
                    status_name: contact["Paid In Full"],
                    primary: {
                        id: foundJnContact.jnid,
                    },
                    // address
                    address_line1: toCapitalize(contact.STREET.toLowerCase()) || "",
                    city: toCapitalize(contact.CITY.toLowerCase()) || "",
                    state_text: toCapitalize(contact.STATE.toLowerCase()) || "",
                    zip: contact["ZIP CODE"] || "",
                    "Warranty Date":
                        new Date(contact["WTY DATE"]).getTime() / 1000 + 86400000 / 1000,
                });

                if (jnJob) {
                    console.log(`Created job: ${jnJob.name}`);

                    await Airtable.updateContact(baseID, table, contact.recordID, {
                        Status: "Success",
                    });
                } else {
                    await Airtable.updateContact(baseID, table, contact.recordID, {
                        Status: "Error",
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
    }
})();
