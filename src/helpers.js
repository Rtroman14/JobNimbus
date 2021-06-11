module.exports = {
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
    },
};
