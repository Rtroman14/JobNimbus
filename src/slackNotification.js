require("dotenv").config();

const axios = require("axios");

module.exports = async (text, preview, url = "") => {
    // notify me about this in Slack
    let accessory;

    if (url !== "") {
        accessory = {
            type: "button",
            text: {
                type: "plain_text",
                text: "Reply",
                emoji: true,
            },
            value: "click_me_123",
            url,
            action_id: "button-action",
        };
    }

    await axios.post(process.env.SLACK_ERROR_ALERTS, {
        text: `JobNimbus error: ${preview}`,
        blocks: [
            {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text,
                },
                accessory,
            },
        ],
    });
};
