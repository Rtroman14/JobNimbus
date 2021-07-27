const Airtable = require("airtable");

module.exports = class AirtableApi {
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error("Using Airtable requires an API key.");
        }

        this.apiKey = apiKey;
    }

    async config(baseID) {
        try {
            return new Airtable({ apiKey: this.apiKey }).base(baseID);
        } catch (error) {
            console.log("NO API KEY PROVIDED ---", error);
        }
    }

    async getContact(baseID, recordID) {
        try {
            const base = await this.config(baseID);

            const res = await base("First Line Ready").find(recordID);

            return res.fields;
        } catch (error) {
            console.log("ERROR GETCONTACT() ---", error);
            return false;
        }
    }

    async getAutomations(table, baseID) {
        try {
            const base = await this.config(baseID);

            const records = await base(table).select().all();

            const automations = records.map((account) => {
                return {
                    ...account.fields,
                    recordID: account.getId(),
                };
            });

            return automations;
        } catch (error) {
            console.log("ERROR GETAUTOMATIONS() ---", error);
            return false;
        }
    }

    async updateContact(baseID, recordID, updatedFields) {
        try {
            const base = await this.config(baseID);

            await base("First Line Ready").update(recordID, updatedFields);
        } catch (error) {
            console.log("ERROR UPDATECONTACT() ---", error);
        }
    }

    async getAccounts(table, view) {
        try {
            const base = await this.config("appGB7S9Wknu6MiQb");

            const res = await base(table).select({ view }).firstPage();

            const accounts = res.map((account) => {
                return {
                    ...account.fields,
                    recordID: account.getId(),
                };
            });

            return accounts;
        } catch (error) {
            console.log("ERROR GETACCOUNTS() ---", error);
        }
    }
};
