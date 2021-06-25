require("dotenv").config();

const axios = require("axios");

module.exports = class JobNimbusApi {
    constructor(token) {
        if (!token) {
            throw new Error("Using Airtable requires an API key.");
        }

        this.token = token;
    }

    getConfig(method, url, data) {
        try {
            if (data) {
                return {
                    method,
                    url: `https://app.jobnimbus.com/api1/${url}`,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify(data),
                };
            }

            return {
                method,
                url: `https://app.jobnimbus.com/api1/${url}`,
                headers: {
                    Authorization: `Bearer ${this.token}`,
                    "Content-Type": "application/json",
                },
            };
        } catch (error) {
            console.log("ERROR CONFIG ---", error);
        }
    }

    async contacts() {
        try {
            const config = this.getConfig("get", "contacts");

            const { data } = await axios(config);

            return data.results;
        } catch (error) {
            console.log("ERROR CREATECONTACT ---", error);
        }
    }

    async getContact(id) {
        try {
            const config = this.getConfig("get", `contacts/${id}`);

            const { data } = await axios(config);

            return data;
        } catch (error) {
            console.log("ERROR GETCONTACT ---", error);
        }
    }

    async createContact(contact) {
        try {
            const config = this.getConfig("post", "contacts", contact);

            const { data } = await axios(config);

            return data;
        } catch (error) {
            console.log("ERROR CREATECONTACT ---", error);
        }
    }

    async createJob(job) {
        try {
            const config = this.getConfig("post", "jobs", job);

            const { data } = await axios(config);

            return data;
        } catch (error) {
            console.log("ERROR CREATEJOB ---", error);
        }
    }

    async getJob(id) {
        try {
            const config = this.getConfig("get", `jobs/${id}`);

            const { data } = await axios(config);

            return data;
        } catch (error) {
            console.log("ERROR GETJOB ---", error);
        }
    }

    async createNote(id, note) {
        try {
            const config = this.getConfig("post", "activities", {
                note,
                record_type_name: "Note",
                primary: {
                    id,
                },
            });

            const { data } = await axios(config);

            return data;
        } catch (error) {
            console.log("ERROR CREATENOTE ---", error);
        }
    }

    baseContact(contact) {
        return {
            display_name: contact["Full Name"],
            first_name: contact["First Name"],
            last_name: contact["Last Name"],
            company: contact["Company Name"] || "",
            email: contact.Email || "",
            mobile_phone: contact["Phone Number"] || "",
            address_line1: contact.Street || "",
            city: contact.City || "",
            state_text: contact.State || "",
            zip: contact.Zip || "",
            description: contact.Notes || "",
        };
    }

    baseJob(jnContact) {
        return {
            name: jnContact.address_line1,
            record_type_name: "Job",
            status_name: "Lead",
            description: jnContact.description,
            primary: {
                id: jnContact.jnid,
            },
            // address
            address_line1: jnContact.address_line1,
            city: jnContact.city,
            state_text: jnContact.state_text,
            zip: jnContact.zip,
        };
    }
};
