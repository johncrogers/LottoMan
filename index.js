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
    const { contents } = require(`${__dirname}/template`);

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
      if (line.includes("☐")) {
        pendingTasks.push(line);
      }
    }
    console.log(pendingTasks.join("\n"));
  }
};
const task = process.argv[2];
const ticketNumber = process.argv[3];
actions[task](ticketNumber);
