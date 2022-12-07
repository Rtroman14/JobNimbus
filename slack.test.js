const slackNotification = require("./src/slackNotification");

(async () => {
    try {
        await slackNotification(
            `There was an error when creating a contact for client: *{account.Client}*`,
            "Error creating contact in Jobnimbus"
        );
    } catch (error) {
        console.log(error);
    }
})();
