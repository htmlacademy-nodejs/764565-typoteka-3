'use strict';

const fs = require(`fs`);
const chalk = require(`chalk`);

module.exports.getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

module.exports.shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

module.exports.writeJsonFile = (fileName, data) => {
  (async () => {
    try {
      const jsonStr = JSON.stringify(data);
      await fs.writeFileSync(fileName, jsonStr);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(err);
      throw new Error(`Can't write data to file...`);
    }
  })();
};
