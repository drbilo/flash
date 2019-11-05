import { send } from "micro";
const cors = require("micro-cors")();

/**
 * 1 - Setup as many response objects as you need
 * (Separate out to different files if it gets messy here)
 */
const defaultResponse = {
  name: "Stannis",
  house: "Baratheon"
};

const housesResponse = {
  houses: ["Lannister", "Greyjoy"]
};

/**
 * 2 - Tell micro when to send each response.
 * Keep routing simple so youll need less routing/mocks
 * e.g. /houses can match /houses/123, /houses/list etc.
 */
const handler = async (req, res) => {
  let statusCode = 200;
  let data = defaultResponse;

  if (req.url === "/error") {
    statusCode = 400;
    data = { error: "Error message text" };
  } else if (req.url.includes("/houses")) {
    data = housesResponse;
  }

  send(res, statusCode, data);
};

export default cors(handler);
