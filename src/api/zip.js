// https://ziptasticapi.com/60061
const axios = require("axios");

module.exports = async (zipCode) => {
    try {
        const { data } = await axios.get(`https://ziptasticapi.com/${zipCode}`);

        return data;
    } catch (error) {
        console.log("ERROR GETTING ZIP ---", error.message);
    }
};
