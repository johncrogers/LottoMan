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
    let pendingTasks = [];
    for (let line of fileContents) {
      if (line.includes(":" && !line.includes("✔"))) {
        pendingTasks.push(line);
      }
      if (line.includes("☐")) {
        pendingTasks.push(line);
      }
    }
    return pendingTasks.join("\n");
  },
  day: (date, ticketNumber) => {
    const { existsSync, mkdirSync, writeFileSync } = require("fs");
    let { day } = require(`${__dirname}/template`);
    day += "\nTASKS:\n";
    day += actions.current(ticketNumber);

    if (!existsSync(`${__dirname}/goals/days`)) {
      mkdirSync(`${__dirname}/goals/days`);
    }
    if (!existsSync(`${__dirname}/goals/days`)) {
      mkdirSync(`${__dirname}/goals/days`);
    }
    if (!existsSync(`${__dirname}/goals/days/${date}`)) {
      mkdirSync(`${__dirname}/goals/days/${date}`);
    }
    writeFileSync(`${__dirname}/goals/days/${date}/TODO`, day);
  }
};
const task = process.argv[2];
const date = process.argv[3];
const ticketNumber = process.argv[4];
actions[task](date, ticketNumber);
