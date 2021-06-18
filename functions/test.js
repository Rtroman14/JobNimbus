require("dotenv").config();

exports.handler = async (event) => {
    if (event.httpMethod === "GET") {
        return {
            statusCode: 200,
            body: JSON.stringify({ msg: "POST request only" }),
        };
    } else if (event.httpMethod === "POST") {
        const res = JSON.parse(event.body);

        const { queryStringParameters } = event;

        console.log("\n ueryStringParameters -->", queryStringParameters);

        return {
            statusCode: 200,
            body: JSON.stringify({ queryStringParameters }),
        };
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: "Error" }),
        };
    }
};
