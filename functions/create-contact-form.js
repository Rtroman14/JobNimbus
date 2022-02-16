require("dotenv").config();

const AirtableApi = require("../src/api/Airtable");
const Airtable = new AirtableApi(process.env.AIRTABLE_API_KEY);

const JobNimbusApi = require("../src/api/JobNimbus");

const HelperApi = require("../src/Helper");
const Helper = new HelperApi();

const clients = require("../src/clients");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const { recordID, baseID, client } = JSON.parse(event.body);

        try {
            let contact = await Airtable.getContact(baseID, "JobNimbus Contact Form", recordID);
            let { additionalContactFields, task } = clients(client, contact);

            additionalContactFields = {
                ...additionalContactFields,
                source_name: client === "Roper Roofing" ? "Micheal Beshears" : "",
                display_name: `${contact["First Name"]} ${contact["Last Name"]}`,
            };

            if (!("Street" in contact)) {
                const address = await Helper.getAddress(contact.Address);
                contact = { ...contact, ...address };
            }

            const [account] = await Airtable.getAccount(client, "Account");
            const JobNimbus = new JobNimbusApi(account["JobNimbus API Key"]);

            // contact fields
            const baseContact = JobNimbus.baseContact(contact);
            const contactFields = { ...baseContact, ...additionalContactFields };

            const jnContact = await JobNimbus.createContact(contactFields);

            if (jnContact) {
                console.log("Created new contact:", jnContact.display_name);

                if ("Appointment" in contact) {
                    const scheduledCallDate = new Date(contact.Appointment);

                    // NOTE: MUST dissable GMT in Airtable
                    // NOTE: related only uses the first instance
                    const newTask = {
                        record_type_name: task.typeName,
                        title: task.title,
                        related: [{ id: jnContact.jnid }], // contact id - shows up under job
                        date_start: scheduledCallDate.getTime(),
                        date_end: scheduledCallDate.setHours(scheduledCallDate.getHours() + 1),
                        owners: [
                            {
                                id:
                                    client === "Roper Roofing"
                                        ? contact.State === "Texas"
                                            ? "kupvda4p80otk256vujlake"
                                            : "2ao08z"
                                        : "38t41a",
                            },
                        ],
                        priority: 1,
                    };

                    const jnTask = await JobNimbus.createTask(newTask);
                    console.log("Created new task:", jnTask.title);
                }
            }

            return {
                statusCode: 200,
                body: JSON.stringify({ jnJob }),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ msg: "Error" }),
            };
        }
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
