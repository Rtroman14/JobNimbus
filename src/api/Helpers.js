module.exports = class HelpersApi {
    async minutesWait(minutes) {
        return await new Promise((resolve) => {
            setTimeout(resolve, 60000 * minutes);
        });
    }

    makeQuery = (string) => string.replace(/\ /g, "%20");
};
