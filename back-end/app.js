require("dotenv").config();
const { App } = require("@slack/bolt");
const { parseFlashCommand } = require("./parseFlashCommand");
import { request } from "graphql-request";

const castLinkMutation = `
mutation castLink($input:CastLinkInput!) {
    castLink(input:$input){
        cast {
            id
            orgId
            teamId
            priority
            content
        }
    }
}`;

// expects [""], uuid, uuid, number
const castLinkInput = (screenIds, teamId, linkId, priority = 10) => {
  return {
    input: {
      screenIds,
      teamId,
      linkId,
      priority
    }
  };
};

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

  // Run GraphQL queries/mutations using a static function
  // request(endpoint, query, variables).then(data => console.log(data))
  //
  // Example:

    const screenIds = [''];
    const teamId = '';
    const linkId = '';
    const priority = 10;

    request('studio.screencloud.com/graphql', castLinkMutation, castLinkInput(screenIds, teamId, linkId, priority))
        .then(data => console.log(data))
        .catch(e => console.log(e));

  say(
    `Here's the message to broadcast: "${commandComponents.message}" of duration ${commandComponents.duration} seconds with type ${commandComponents.level}`
  );
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
