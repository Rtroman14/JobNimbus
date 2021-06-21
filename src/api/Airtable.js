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

    async updateContact(baseID, recordID, updatedFields) {
        try {
            const base = await this.config(baseID);

            await base("First Line Ready").update(recordID, updatedFields);
        } catch (error) {
            console.log("ERROR UPDATECONTACT() ---", error);
        }
    }

    async getCampaigns(table, view) {
        try {
            const base = await this.assignAirtable("appGB7S9Wknu6MiQb");

            const res = await base(table).select({ view }).firstPage();

            const campaigns = res.map((campaign) => {
                return {
                    ...campaign.fields,
                    recordID: campaign.getId(),
                };
            });

            return campaigns;
        } catch (error) {
            console.log("ERROR GETCAMPAIGNS() ---", error);
        }
    }
};
