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
};
