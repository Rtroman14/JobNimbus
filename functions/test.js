require("dotenv").config();

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        console.log("EVENT");
        console.log(event);

        console.log("\nevent.QueryStringParameters -->", event.QueryStringParameters);

        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);

        console.log(res);

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
