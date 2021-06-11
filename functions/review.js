require("dotenv").config();

const JobNimbusApi = require("../src/api/JobNimbus");
const JobNimbus = new JobNimbusApi(process.env.JOBNIMBUS_TOKEN);

const { makeHighlevelContact } = require("../src/helpers");

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const { jnid, related } = JSON.parse(event.body);

        console.log(JSON.parse(event.body));

        const campaignID = "IsujRiyMNv0fmRF698D1";

        // get contact associated with job
        const contact = await JobNimbus.getContact(related[0].id);
        const highLevelContact = makeHighlevelContact(contact);

        const outreachResponse = await Highlevel.outreachContact(highLevelContact, campaignID);
        console.log({ outreachResponse });

        // add note on job
        const note = `Sent ${related[0].name} a review request.`;
        const noteResponse = await JobNimbus.createNote(jnid, note);
        console.log({ noteResponse });

        return {
            statusCode: 200,
            body: JSON.stringify({ noteResponse }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
