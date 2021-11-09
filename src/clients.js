module.exports = (client, contact = { Research: "", Response: "", Tag: "" }) => {
    const clients = [
        {
            client: "Eco Tec",
            additionalContactFields: {
                record_type_name: "Roof Coatings",
                status_name: "Lead",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
                Response: contact.Response || "",
                Service: "Roof Coatings",
                source_name: "Summa Media - Outreach Program",
                sales_rep_name: "Sarha Hughes",
                owners: [{ id: "ktvyzw07gmg4k8rwonyd16n" }], // Owner === "Sarha Hughes"
                location: { id: 1 }, // Eco Tec
            },
            additionalJobFields: {
                name: `${contact["Last Name"] || ""}, ${contact["First Name"] || ""}`,
                sales_rep_name: "Sarha Hughes",
                record_type_name: "Roof Coatings",
                source_name: "Summa Media - Outreach Program",
                owners: [{ id: "ktvyzw07gmg4k8rwonyd16n" }], // Owner === "Sarha Hughes"
                location: { id: 1 }, // Eco Tec
            },
            team: [
                {
                    name: "Sarha Hughes",
                    id: "ktvyzw07gmg4k8rwonyd16n",
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
                sales_rep_name: "Josh Knight",
                record_type_name: "Residential Replacement",
                source_name: "Summa Media",
                location: { id: 1 }, // I Am Roofing
                ["Production Coordinator"]: "Brian Ford",
                ["Business Development"]: "Josh Knight",
                Administration: "Angela Ford",
                Technician: "Matt Johnson",
            },
            scheduledCall: {
                salesRep: "3aekxj", // team member id who will be assigned to the task: New Lead - Follow Up
                jobStatusName: "Lead Follow Up",
            },
            leadFollowUp: "3aekxj", // team member id who will be assigned to the task: New Lead - Follow Up
            team: [
                {
                    name: "Josh Knight",
                    id: "3aekxj",
                },
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
                location: { id: contact.Tag === "austin" ? 2 : 1 },
            },
            additionalJobFields: {
                name: `${contact["First Name"] || ""} ${contact["Last Name"] || ""}`,
                status_name: "Lead",
                sales_rep_name: contact.Tag === "austin" ? "Johno Skeeters" : null,
                record_type_name: "Residential Roofing",
                source_name: "Summa Media",
                location: { id: contact.Tag === "austin" ? 2 : 1 },
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
        {
            client: "All Area Roofing",
            additionalContactFields: {
                record_type_name: "Customer",
                status_name: "Active",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
                Response: contact.Response || "",
                source_name: "Summa Media",
                // location: { id: 1 },
            },
            additionalJobFields: {
                name: `${contact["First Name"] || ""} ${contact["Last Name"] || ""}`,
                status_name: "Summa Lead",
                record_type_name: "Commercial Replacement",
                source_name: "Summa Media",
                // location: { id: 1 },
            },
            scheduledCall: {
                salesRep: "kqbfh28gdquulk9goto4ylv", // team member id who will be assigned to the task: New Lead - Follow Up
                jobStatusName: "Lead Follow Up",
            },
            leadFollowUp: "kqbfh28gdquulk9goto4ylv", // team member id who will be assigned to the task: New Lead - Follow Up
            team: [
                {
                    name: "Jennifer Richards",
                    id: "kqbfh28gdquulk9goto4ylv",
                },
            ],
        },
    ];

    return clients.find((clientObj) => clientObj.client === client);
};
