module.exports = (client, contact = { Research: "", Response: "" }) => {
    const clients = [
        {
            client: "eco-tec",
            additionalContactFields: {
                record_type_name: "Customer",
                status_name: "Active",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
                Response: contact.Response || "",
                source_name: "Summa Media - Outreach Program",
                sales_rep_name: "Ryan Roman",
                owners: [{ id: "kpwrz7poastl1hfqz2o6yix" }], // Owner === "Ryan Roman"
                location: { id: 1 }, // Eco Tec Foam And Coatings
            },
            additionalJobFields: {
                sales_rep_name: "Ryan Roman",
                record_type_name: "Roof Coatings",
                source_name: "Summa Media - Outreach Program",
                owners: [{ id: "kpwrz7poastl1hfqz2o6yix" }], // Owner === "Ryan Roman"
                location: { id: 1 }, // Eco Tec Foam And Coatings
            },
            teamMembers: [{}],
        },
    ];

    return clients.find((clientObj) => clientObj.client === client);
};
