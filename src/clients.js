module.exports = (client, contact = { Research: "", Response: "" }) => {
    const clients = [
        {
            client: "Eco Tec Foam And Coatings",
            additionalContactFields: {
                record_type_name: "Customer",
                status_name: "Active",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
                Response: contact.Response || "",
                Service: "Roof Coatings",
                source_name: "Summa Media - Outreach Program",
                sales_rep_name: "Ryan Roman",
                owners: [{ id: "kpwrz7poastl1hfqz2o6yix" }], // Owner === "Ryan Roman"
                location: { id: 1 }, // Eco Tec Foam And Coatings
            },
            additionalJobFields: {
                name: `${contact["Last Name"] || ""}, ${contact["First Name"] || ""}`,
                sales_rep_name: "Ryan Roman",
                record_type_name: "Roof Coatings",
                source_name: "Summa Media - Outreach Program",
                owners: [{ id: "kpwrz7poastl1hfqz2o6yix" }], // Owner === "Ryan Roman"
                location: { id: 1 }, // Eco Tec Foam And Coatings
            },
            team: [
                {
                    name: "Ryan Roman",
                    id: "kpwrz7poastl1hfqz2o6yix",
                },
                {
                    name: "Chris Pendergast",
                    id: "",
                },
            ],
        },
        {
            client: "I Am Roofing",
            additionalContactFields: {
                record_type_name: "Customer",
                status_name: "Active",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
                Response: contact.Response || "",
                source_name: "Summa Media",
                location: { id: 1 }, // I Am Roofing
            },
            additionalJobFields: {
                name: `${contact["Last Name"] || ""}, ${contact["First Name"] || ""}`,
                status_name: "Summa Lead",
                sales_rep_name: "Logan Walston",
                record_type_name: "Residential Replacement",
                source_name: "Summa Media",
                location: { id: 1 }, // I Am Roofing
                ["Production Coordinator"]: "Brian Ford",
                ["Business Development"]: "Josh Knight",
                Administration: "Angela Ford",
                Technician: "Matt Johnson",
            },
            scheduledCall: {
                salesRep: "35w4ow", // team member id who will be assigned to the task: New Lead - Follow Up
                jobStatusName: "Lead Follow Up",
            },
            leadFollowUp: "35w4ow", // team member id who will be assigned to the task: New Lead - Follow Up
            team: [
                {
                    name: "Logan Walston",
                    id: "35w4ow",
                },
            ],
        },
        {
            client: "Roper Roofing",
            additionalContactFields: {
                record_type_name: "Customers",
                status_name: "Active",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
                Response: contact.Response || "",
                source_name: "Summa Media",
                location: { id: 1 },
            },
            additionalJobFields: {
                name: `${contact["First Name"] || ""} ${contact["Last Name"] || ""}`,
                status_name: "Lead",
                // sales_rep_name: "",
                record_type_name: "Residential Roofing",
                source_name: "Summa Media",
                location: { id: 1 },
            },
            scheduledCall: {
                salesRep: "2ao08z", // team member id who will be assigned to the task: New Lead - Follow Up
                jobStatusName: "Lead Follow Up",
            },
            leadFollowUp: "2ao08z", // team member id who will be assigned to the task: New Lead - Follow Up
            team: [
                {
                    name: "Brent Roper",
                    id: "2ao08z",
                },
            ],
        },
    ];

    return clients.find((clientObj) => clientObj.client === client);
};
