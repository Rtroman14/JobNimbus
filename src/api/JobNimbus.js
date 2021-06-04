require("dotenv").config();

const axios = require("axios");

module.exports = class JobNimbus {
    constructor(token) {
        this.token = token;
    }

    getConfig(method, slug, data) {
        try {
            if (data) {
                return {
                    method,
                    url: `https://app.jobnimbus.com/api1/${slug}`,
                    headers: {
                        Authorization: `Bearer ${this.token}`,
                        "Content-Type": "application/json",
                    },
                    data: JSON.stringify(data),
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
            const config = this.getConfig("get", "contacts");

            const res = await axios(config);

            return res.data.results;
        } catch (error) {
            console.log("ERROR CREATECONTACT ---", error);
        }
    }

    async contact(data) {
        try {
            const config = this.getConfig("post", "contacts", data);

            const res = await axios(config);

            return res.data.results;
        } catch (error) {
            console.log("ERROR CREATECONTACT ---", error);
        }
    }
};
