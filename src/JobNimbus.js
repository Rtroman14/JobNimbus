1require("dotenv").config();

const axios = require("axios");

module.exports = class JobNimbus {
    constructor(token) {
        this.token = token;
    }

    getConfig(method, url, data) {
        try {
            if (data) {
                return {
                    method,
                    url,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json",
                    },
                    data,
                };
            }

            return {
                method,
                url,
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
            const config = this.getConfig("get", "https://app.jobnimbus.com/api1/contacts");

            const res = await axios(config);

            return res.data.results;
        } catch (error) {
            console.log("ERROR CREATECONTACT ---", error);
        }
    }
};
