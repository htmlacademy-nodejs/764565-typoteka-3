'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const userAdmin = require(`./constants`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};

const readContentFromFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`).map((item) => item.replace(`\r`, ``));
  } catch (err) {
    console.error(chalk.red(`Error read file: ${filePath} ${err.message}`));
    throw new Error(`Can't read data from file...`);
  }
};

const readContentFromJsonFile = async (fileName) => {
  try {
    const fileContent = await fs.readFile(fileName);
    return JSON.parse(fileContent);
  } catch (err) {
    console.error(chalk.red(`Error read file: ${fileName} ${err.message}`));
    throw new Error(`Can't read data from file...`);
  }
};

const writeJsonFile = async (fileName, data) => {
  try {
    const jsonStr = JSON.stringify(data);
    await fs.writeFile(fileName, jsonStr);
    console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    console.error(chalk.red(`Error write file: ${fileName} ${err.message}`));
    throw new Error(`Can't write data to file...`);
  }
};

const ensureArray = (value) => Array.isArray(value) ? value : [value];

const prepareErrors = (errors) => {
  return errors.response.data.split(`\n`);
};

const checkAdminRole = (user) => {
  let isUserAdmin = false;
  if (user) {
    isUserAdmin = user.id === userAdmin.ADMIN_ID.userId;
  }
  return isUserAdmin;
};

module.exports = {getRandomInt, shuffle, readContentFromFile, readContentFromJsonFile, writeJsonFile, ensureArray, prepareErrors, checkAdminRole};
