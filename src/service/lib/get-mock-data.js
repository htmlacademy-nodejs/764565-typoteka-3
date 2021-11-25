'use strict';

const {
  readContentFromJsonFile,
} = require(`../../utils`);
const {getLogger} = require(`./logger`);
const FILENAME = `mocks.json`;

const logger = getLogger({name: `api`});

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    data = await readContentFromJsonFile(FILENAME);
  } catch (err) {
    logger.error(`Route not found: ${err.message}`);
    return (err);
  }

  return data;
};

module.exports = getMockData;
