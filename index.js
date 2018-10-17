let actions = {
  create: () => {
    const { existsSync, mkdirSync, writeFileSync } = require("fs");
    const { contents } = require(`${__dirname}/template`);
    let ticketNumber = process.argv[3];
    if (!existsSync(`${__dirname}/tickets`)) {
      mkdirSync(`${__dirname}/tickets`);
    }
    if (!existsSync(`${__dirname}/tickets/${ticketNumber}`)) {
      mkdirSync(`${__dirname}/tickets/${ticketNumber}`);
    }
    writeFileSync(`${__dirname}/tickets/${ticketNumber}/TODO`, contents);
  }
};
let task = process.argv[2];
actions[task]();
