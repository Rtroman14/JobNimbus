const slackNoti = require("../src/slackNoti");

(async () => {
    try {
        await slackNoti("username", "Hello world", "U015DDAJAAJ");
    } catch (error) {
        console.error(error);
    }
})();
