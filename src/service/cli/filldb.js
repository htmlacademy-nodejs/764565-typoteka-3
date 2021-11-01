'use strict';

const chalk = require(`chalk`);
const {getLogger} = require(`../lib/logger`);
const sequelize = require(`../sequelize`);
const initDatabase = require(`../lib/init-db`);

const {
  getRandomInt,
  shuffle,
  readContentFromFile,
} = require(`../../utils`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_PUBLICATIONS_COUNT = 1;
const MAX_PUBLICATIONS_COUNT = 1000;

const MAX_CATEGORIES = 4;

const logger = getLogger({});

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

const generateRandomComments = (comments) => {

  const count = getRandomInt(1, comments.length);
  return Array(count).fill({}).map(() => ({
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `)
      .replace(`\r`, ``)
      .slice(0, 249),
  }));
};

const generatePublications = (count, titles, categories, sentences, comments) => {
  return Array(count).fill({}).map(() => ({
    title: generateRandomTitle(titles),
    announce: generateRandomAnnounce(sentences),
    description: generateRandomFullText(sentences),
    category: generateRandomCategory(categories),
    comments: generateRandomComments(comments),
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
      await sequelize.getInstance().authenticate();
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
        readContentFromFile(FILE_SENTENCES_PATH),
        readContentFromFile(FILE_TITLES_PATH),
        readContentFromFile(FILE_CATEGORIES_PATH),
        readContentFromFile(FILE_COMMENTS_PATH)
      ]);

      const articles = generatePublications(countPublications, titles, categories, sentences, comments);
      console.log(articles);
      return initDatabase({articles, categories});
    } catch (err) {
      console.log(chalk.red(err.message));
      throw err;
    }
  }
};
