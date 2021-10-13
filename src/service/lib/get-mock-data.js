'use strict';

const {
  readContentFromJsonFile,
} = require(`../../utils`);

const FILENAME = `mocks.json`;
let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    data = await readContentFromJsonFile(FILENAME);
  } catch (err) {
    console.log(err);
    return (err);
  }

  return data;
};

module.exports = getMockData;
