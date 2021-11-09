require("dotenv").config();

const axios = require("axios");

const JobNimbusApi = require("./src/api/JobNimbus");
const JobNimbus = new JobNimbusApi("kpih52lhy128g744");

const HelperApi = require("./src/Helper");
const Helper = new HelperApi();

(async () => {
    try {
        const jnJobs = await JobNimbus.getAllJobs();
        const contacts = await JobNimbus.getAllContacts();

        // const jnJob = await JobNimbus.getJob("kvmsemok8wc53ih8joe0nav");
        // console.log(jnJob);

        const contactsWithJobs = jnJobs.results.map((job) => job.primary.id);

        const contactsWithoutJobs = contacts.results.filter(
            (contact) => !contactsWithJobs.includes(contact.jnid)
        );

        const arrayOfContactsWithoutJobs = contactsWithoutJobs.map((contact) => {
            const jobFields = {
                record_type_name: "Job",
                status_name: contact.status_name,
                description: contact.description,
                primary: {
                    id: contact.jnid,
                },
                address_line1: contact.address_line1,
                address_line2: contact.address_line2,
                city: contact.city,
                state_text: contact.state_text,
                zip: contact.zip,
                name: contact.display_name,
                sales_rep_name: contact.sales_rep_name,
                record_type_name:
                    contact.record_type_name === "Insulation Sales"
                        ? "Insulation"
                        : contact.record_type_name,
                source_name: contact.source_name,
                owners: contact.owners,
                location: contact.location,
                Confidence: contact.Confidence,
                Service: contact.Service,
            };

            return JobNimbus.createJob(jobFields);
        });

        const res = await Promise.all(arrayOfContactsWithoutJobs);
        console.log(res);

        // // for each contact --> create job and assign contact
        // for (let contact of contactsWithoutJobs) {
        //     const jobFields = {
        //         record_type_name: "Job",
        //         status_name: contact.status_name,
        //         description: contact.description,
        //         primary: {
        //             id: contact.jnid,
        //         },
        //         address_line1: contact.address_line1,
        //         address_line2: contact.address_line2,
        //         city: contact.city,
        //         state_text: contact.state_text,
        //         zip: contact.zip,
        //         name: contact.display_name,
        //         sales_rep_name: contact.sales_rep_name,
        //         record_type_name:
        //             contact.record_type_name === "Insulation Sales"
        //                 ? "Insulation"
        //                 : contact.record_type_name,
        //         source_name: contact.source_name,
        //         owners: contact.owners,
        //         location: contact.location,
        //         Confidence: contact.Confidence,
        //         Service: contact.Service,
        //     };

        //     try {
        //         const jnJob = await JobNimbus.createJob(jobFields);
        //         console.log(`Created job: ${jnJob.jnid}`);
        //     } catch (error) {
        //         console.log("Error creating job -", error);
        //     }
        // }
    } catch (error) {
        console.log(error);
    }
})();

// https://documenter.getpostman.com/view/3919598/S11PpG4x?version=latest#7ec1541f-7241-4840-9322-0ed83c01d48e
