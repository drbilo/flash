// Method: Find the first double quote, and assume everything after that is the messageStart
// the command order is expected to be of the space-separated form:
//
// -> level duration message
function parseFlashCommand(commandString) {
  const messageStart = commandString.indexOf('"');

  const [level, durationRaw] = commandString
    .substring(0, messageStart)
    .split(" ");
  const message = commandString.substring(
    messageStart + 1,
    commandString.length - 1
  );

  // Level is input as minutes and returns as seconds
  const duration = durationRaw * 60;

  return { level, duration, message };
}

module.exports = parseFlashCommand;
