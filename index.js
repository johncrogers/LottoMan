let actions = {
  init: () => {
    const { writeFileSync } = require("fs");
    const workspace =
      "{" +
      '  "folders": [' +
      "    {" +
      `      "path": "${__dirname}"` +
      "    }" +
      "  ]," +
      '  "settings": {}' +
      "}";
    writeFileSync(`${__dirname}/tp.code-workspace`, workspace);
  },
  open: () => {
    const { execSync } = require("child_process");
    execSync(`open ${__dirname}/tp.code-workspace`);
  },
  create: ticketNumber => {
    const { existsSync, mkdirSync, writeFileSync } = require("fs");
    const { ticket } = require(`${__dirname}/template`);

    if (!existsSync(`${__dirname}/tickets`)) {
      mkdirSync(`${__dirname}/tickets`);
    }
    if (!existsSync(`${__dirname}/tickets/active`)) {
      mkdirSync(`${__dirname}/tickets/active`);
    }
    if (!existsSync(`${__dirname}/tickets/active/${ticketNumber}`)) {
      mkdirSync(`${__dirname}/tickets/active/${ticketNumber}`);
    }
    writeFileSync(`${__dirname}/tickets/active/${ticketNumber}/TODO`, contents);
  },
  read: ticketNumber => {
    const { readFileSync } = require("fs");
    const contents = readFileSync(
      `${__dirname}/tickets/active/${ticketNumber}/TODO`,
      { encoding: "utf8" }
    );

    return contents;
  },
  print: ticketNumber => {
    let file = actions.read(ticketNumber);

    console.log(file);
  },
  current: ticketNumber => {
    let fileContents = actions.read(ticketNumber).split("\n");
    let documentLines = [];
    for (let line of fileContents) {
      let isHeader = line.includes(":") && !line.includes("✔");
      let isEndOfDocument = line.includes("DOCUMENT FINDINGS:");
      let previousLine = documentLines[documentLines.length - 1];
      let isLastLineHeader =
        documentLines.length &&
        previousLine.includes(":") &&
        !previousLine.includes("✔");
      let isPendingTask = line.includes("☐");
      let documentContents = documentLines.join("\n");

      if (isHeader) {
        if (isEndOfDocument) {
          // Exclude newly discovered issues.
          return documentContents;
        }
        if (isLastLineHeader) {
          // Exclude empty sections.
          documentLines.pop();
        }
        documentLines.push(line);
      }
      if (isPendingTask) {
        documentLines.push(line);
      }
    }
    return documentContents;
  },
  day: (date, ticketNumber) => {
    const { existsSync, mkdirSync, writeFileSync } = require("fs");
    let { day } = require(`${__dirname}/template`);
    let noGoalsFolder = !existsSync(`${__dirname}/goals`);
    let noDaysFolder = !existsSync(`${__dirname}/goals/days`);
    let noDateFolder = !existsSync(`${__dirname}/goals/days/${date}`);

    day += "\n\nAGENDA:\n";
    day += actions.current(ticketNumber);

    if (noGoalsFolder) {
      mkdirSync(`${__dirname}/goals`);
    }
    if (noDaysFolder) {
      mkdirSync(`${__dirname}/goals/days`);
    }
    if (noDateFolder) {
      mkdirSync(`${__dirname}/goals/days/${date}`);
    }
    writeFileSync(`${__dirname}/goals/days/${date}/TODO`, day);
  }
};
const task = process.argv[2];
const date = process.argv[3];
const ticketNumber = process.argv[4];
actions[task](date, ticketNumber);
