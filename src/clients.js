const southALZips = [
    36528, 36542, 36511, 36523, 36535, 36555, 36509, 36536, 36530, 36549, 36564, 36580, 36544,
    36532, 36541, 36582, 36568, 36576, 36533, 36574, 36590, 36559, 36619, 36605, 36526, 36567,
    36693, 36695, 36615, 36551, 36609, 36577, 36606, 36608, 36685, 36604, 36603, 36602, 36601,
    36628, 36633, 36640, 36641, 36644, 36652, 36660, 36663, 36670, 36671, 36675, 36689, 36691,
    36688, 36616, 36607, 36617, 36610, 36618, 36527, 36578, 36612, 36611, 36575, 36613, 36587,
    36572, 36571, 36507, 36525, 36505, 36521, 36512, 36455, 36314, 36503, 36504, 36522, 36562,
    36320, 36441, 36442, 36340, 36579, 36560, 36344, 36343, 36375, 36427, 36370, 36483, 36477,
    36349, 36426, 36301, 36513, 36318, 36502, 36313, 36316, 36312, 36305, 36529, 36453, 36550,
    36556, 36321, 36543, 36302, 36304, 36420, 36322, 36553, 36376, 36429, 36303, 36584, 36352,
    36467, 36371, 36331, 36454, 36473, 36432, 36480, 36421, 36319, 36449, 36539, 36345, 36581,
    36476, 36330, 36457, 36583, 36585, 36362, 36351, 36323, 36439, 36038, 36445, 36475, 36474,
    36545, 36540, 36548, 36401, 36470, 36460, 36458, 36518, 36461, 36569, 36456, 36558, 36482,
    36538, 36451,
];

module.exports = (client, contact = { Research: "", Tag: "" }) => {
    const clients = [
        {
            client: "Eco Tec",
            additionalContactFields: {
                record_type_name: "Roof Coatings",
                status_name: "Lead",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
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
                source_name: "Summa Media",
                location: { id: 1 }, // I Am Roofing
            },
            additionalJobFields: {
                name: `${contact["Last Name"] || ""}, ${contact["First Name"] || ""}`,
                status_name: "Summa Lead",
                sales_rep_name: "Angela Ford",
                // sales_rep_name: southALZips.includes(Number(contact.Zip))
                //     ? "Katie Hagan"
                //     : "Josh Knight",
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
                sales_rep_name:
                    contact.Tag === "austin" || contact.State === "Texas"
                        ? "Johno Skeeters"
                        : "Brent Roper",
                source_name: "Summa Media",
                location: { id: contact.Tag === "austin" || contact.State === "Texas" ? 2 : 1 },
            },
            additionalJobFields: {
                name: `${contact["Last Name"] || ""}, ${contact["First Name"] || ""} `,
                status_name: "Lead",
                sales_rep_name:
                    contact.Tag === "austin" || contact.State === "Texas"
                        ? "Johno Skeeters"
                        : "Brent Roper",
                record_type_name: "Residential Roofing",
                source_name: "Summa Media",
                location: { id: contact.Tag === "austin" || contact.State === "Texas" ? 2 : 1 },
            },
            scheduledCall: {
                salesRep: "2ao08z", // team member id who will be assigned to the task: New Lead - Follow Up
                jobStatusName: "Lead Follow Up",
            },
            leadFollowUp: "2ao08z", // team member id who will be assigned to the task: New Lead - Follow Up
            team: [
                { name: "Brent Roper", id: "2ao08z" },
                { name: "Johno Skeeters", id: "kupvda4p80otk256vujlake" },
            ],
        },
        {
            client: "All Area Roofing",
            additionalContactFields: {
                record_type_name: "Customer",
                status_name: "Active",
                Research: contact["First Line"] || contact["FIRST LINE"] || "",
                source_name: "Summa Media",
                // location: { id: 1 },
            },
            additionalJobFields: {
                name: `${contact["First Name"]?.toUpperCase() || ""} ${
                    contact["Last Name"]?.toUpperCase() || ""
                }`,
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
