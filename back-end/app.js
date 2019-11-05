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
  const commandComponents = parseFlashCommand(command);

  const endpoint = "https://graphql.eu.screencloud.com/graphql";
  const studioApiToken =
    "c6a42c7a-1270-41b1-afb2-f44b85b7d156:eee04829c25ab9cab055fb46f997710c";
  const screenIds = ["75b5cfbf-6294-4650-b70a-e7a8c6c65a95"];
  const teamId = "7887918f-6855-4861-bfdd-dd66bbba1ad3";
  const linkId = "e1c673d9-8324-4133-b1da-b9878c01ed92";
  const priority = 10;

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization: `Bearer ${studioApiToken}`
    }
  });

  // Run mutation to cast
  try {
    const data = await graphQLClient.request(
      castLinkMutation,
      castLinkInput(screenIds, teamId, linkId, 10)
    );
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log(e);
  }

  say(
    `Here's the message to broadcast: "${commandComponents.message}" of duration ${commandComponents.duration} seconds with type ${commandComponents.level}`
  );
});

(async () => {
  // Start the app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
