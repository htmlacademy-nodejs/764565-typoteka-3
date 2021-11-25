'use strict';

const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../api/sequelize`);
const passwordUtils = require(`../lib/password`);
const initDatabase = require(`../lib/init-db`);
const {
  getRandomInt,
  shuffle,
  readContentFromFile,
} = require(`../../utils`);

const FILE_PATH = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`
};
const DEFAULT_PUBLICATIONS_COUNT = 1;
const MAX_PUBLICATIONS_COUNT = 1000;
const MAX_CATEGORIES = 4;

const logger = getLogger({});

const generateRandomUser = (users) => {
  return users[getRandomInt(0, users.length - 1)].email;
};

const generateRandomTitle = (titles) => {
  return titles[getRandomInt(0, titles.length - 1)].slice(0, 249);
};

const generateRandomAnnounce = (sentences) => {
  return shuffle(sentences).slice(0, 4).join(` `).slice(0, 249);
};

const generateRandomFullText = (sentences) => {
  return shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `).slice(0, 999);
};

const generateRandomCategory = (categories) => {
  return shuffle(categories).slice(0, getRandomInt(1, MAX_CATEGORIES));
};

const generateRandomComments = (comments, users) => {
  const count = getRandomInt(1, comments.length);
  return Array(count).fill({}).map(() => ({
    user: users[getRandomInt(0, users.length - 1)].email,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `)
      .replace(`\r`, ``)
      .slice(0, 249),
  }));
};

const generatePublications = (count, titles, categories, sentences, comments, users) => {
  return Array(count).fill({}).map(() => ({
    user: generateRandomUser(users),
    title: generateRandomTitle(titles),
    announce: generateRandomAnnounce(sentences),
    description: generateRandomFullText(sentences),
    category: generateRandomCategory(categories),
    comments: generateRandomComments(comments, users),
  }));
};

const checkCountPublicationsOverflow = (countPublications) => {
  if (countPublications <= MAX_PUBLICATIONS_COUNT) {
    return;
  } else {
    throw new Error(`Не больше ` + MAX_PUBLICATIONS_COUNT + ` публикаций`);
  }
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Connection to database established`);

    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_PUBLICATIONS_COUNT;
    try {
      checkCountPublicationsOverflow(countPublications);

      const [sentences, titles, categories, comments] = await Promise.all([
        readContentFromFile(FILE_PATH.SENTENCES),
        readContentFromFile(FILE_PATH.TITLES),
        readContentFromFile(FILE_PATH.CATEGORIES),
        readContentFromFile(FILE_PATH.COMMENTS)
      ]);
      const users = [
        {
          firstName: `Иван`,
          lastName: `Иванов`,
          email: `ivanov@example.com`,
          passwordHash: await passwordUtils.hash(`ivanov`)
        },
        {
          firstName: `Пётр`,
          lastName: `Петров`,
          email: `petrov@example.com`,
          passwordHash: await passwordUtils.hash(`petrov`)
        }
      ];

      const articles = generatePublications(countPublications, titles, categories, sentences, comments, users);
      return initDatabase(sequelize, {articles, categories, users});
    } catch (err) {
      console.log(chalk.red(err.message));
      throw err;
    }
  }
};
