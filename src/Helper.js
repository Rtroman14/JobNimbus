const axios = require("axios");

module.exports = class HelperApi {
    async getAddress(address) {
        try {
            const zip = address.split(" ").pop();

            const { city, state } = await this.getZip(zip);

            const streetIndex = address.toLowerCase().lastIndexOf(city.toLowerCase());
            let street = address.slice(0, streetIndex).trim();
            street = street = street.slice(-1) === "," ? street.slice(0, -1) : street;

            return {
                Street: street,
                City: city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
                State: state,
                Zip: zip,
            };
        } catch (error) {
            console.log("ERROR GETTING ADDRESS ---", error.message);
            return false;
        }
    }

    async getZip(zipCode) {
        try {
            const { data } = await axios.get(`https://ziptasticapi.com/${zipCode}`);

            return data;
        } catch (error) {
            console.log("ERROR GETTING ZIP ---", error.message);
            return false;
        }
    }

    makeHighlevelContact(contact) {
        const address1 = `${contact.address_line1} ${contact.address_line2}`;

        const phones = [contact.mobile_phone, contact.work_phone, contact.home_phone];

        const phone = phones.find((number) => number !== "");

        return {
            firstName: contact.first_name || "",
            lastName: contact.last_name || "",
            name: contact.display_name,
            email: contact.email || "",
            phone: phone || "",
            address1: address1 || "",
            city: contact.city || "",
            state: contact.state_text || "",
            postalCode: contact.zip || "",
        };
    }
};
