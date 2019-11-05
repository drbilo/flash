require('dotenv').config()
const { App } = require('@slack/bolt');
const { parseFlashCommand } = require("./parseFlashCommand");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

/* Add functionality here */
app.command("/flash", async ({ command, ack, say }) => {
  // Acknowledge command request
  ack();
  const message = command.text;
  const commandComponents = parseFlashCommand(command);

  say(`Here's the message to broadcast: "${commandComponents.message}" of duration ${commandComponents.duration} seconds with type ${commandComponents.level}`);
});


(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();