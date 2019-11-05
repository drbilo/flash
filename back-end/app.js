require("dotenv").config();
const { App } = require("@slack/bolt");
const { parseFlashCommand } = require("./parseFlashCommand");
import { request } from "graphql-request";

const allScreensQuery = `
    query {
      allScreens {
        nodes {
          id
          teamId
          name
        }
      }
    }
`;

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
  const commandComponents = parseFlashCommand(command.text);

  // Run GraphQL queries/mutations using a static function
  // request(endpoint, query, variables).then(data => console.log(data))
  //
  // Example:
  const screencloudGraphqlEndpoint =
    "https://graphql.eu.screencloud.com/graphql";
  const screenIds = ["75b5cfbf-6294-4650-b70a-e7a8c6c65a95"];
  const teamId = "7887918f-6855-4861-bfdd-dd66bbba1ad3";
  const linkId = "e1c673d9-8324-4133-b1da-b9878c01ed92";
  const priority = 10;

  // graphql library method, try?
  request(
    screencloudGraphqlEndpoint,
    castLinkMutation,
    castLinkInput(screenIds, teamId, linkId, priority)
  )
    .then(data => console.log(data))
    .catch(e => console.log(e));
  say(`⚡️Here's the message to broadcast: "${commandComponents.message}" \n ⚡️Duration: ${commandComponents.duration} seconds \n ⚡️ Type: ${commandComponents.level}`);
});

  say(
    `Here's the message to broadcast: "${commandComponents.message}" of duration ${commandComponents.duration} seconds with type ${commandComponents.level}`
  );
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log('⚡️ Flash app is running!');
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
