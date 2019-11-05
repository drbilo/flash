require('dotenv').config()
const { App } = require('@slack/bolt');
//const { parseFlashCommand } = require("./parseFlashCommand");

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});

/* Add functionality here */
app.command("/flash", async ({ command, ack, say }) => {
  // Acknowledge command request
  ack();
  const message = command.text;
  const commandComponents = parseFlashCommand(command.text);

  say(`Here's the message to broadcast: "${commandComponents.message}" of duration ${commandComponents.duration} seconds with type ${commandComponents.level}`);
});


(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Bolt app is running!');
})();


function parseFlashCommand(commandString) {
  const messageStart = commandString.indexOf('"');
  const defaultDuration = 1; // minute
  const defaultLevel = "info";

  let [level, durationRaw] = commandString
    .substring(0, messageStart)
    .split(" ");

  const message = commandString.substring(
    messageStart + 1,
    commandString.length - 1
  );

  // set reasonable defaults if missing any part of command
  if (!level) {
    level = defaultLevel;
  }
  if (!durationRaw) {
    durationRaw = defaultDuration;
  }

  // Level is input as minutes and returns as seconds
  const duration = durationRaw * 60;

  return { level, duration, message };
}