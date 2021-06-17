require("dotenv").config();

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        console.log("EVENT");
        console.log(event);

        console.log("\nevent.queryStringParameters -->", event.queryStringParameters);
        // https://jobnimbus.netlify.app/.netlify/functions/test?client=eco-tec
        // event.queryStringParameters --> { client: 'eco-tec' }

        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);

        // console.log(res);

        console.log("\nEVENT -->", event);
        console.log("\nevent.queryStringParameters -->", event.queryStringParameters);
        console.log("\nevent.queryStringParameters.client -->", event.queryStringParameters.client);

        return {
            statusCode: 200,
            body: JSON.stringify({ res }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
