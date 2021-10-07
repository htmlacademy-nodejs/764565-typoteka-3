'use strict';

const chalk = require(`chalk`);

const {
  getRandomInt,
  shuffle,
  writeJsonFile,
  readContentFromFile,
} = require(`../../utils`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const DEFAULT_PUBLICATIONS_COUNT = 1;
const MAX_PUBLICATIONS_COUNT = 1000;
const FILE_NAME = `mocks.json`;

const generateRandomTitle = (titles) => {
  return titles[getRandomInt(0, titles.length - 1)];
};

const generateRandomCreatedDate = (date) => {
  return new Date(getRandomInt(date.setMonth(date.getMonth() - 3), date));
};

const generateRandomAnnounce = (sentences) => {
  return shuffle(sentences).slice(0, 4).join(` `);
};

const generateRandomFullText = (sentences) => {
  return shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `);
};

const generateRandomCategory = (categories) => {
  return categories[getRandomInt(0, categories.length - 1)];
};

const generatePublications = (count, titles, categories, sentences) => {
  const currentDate = new Date();
  return Array(count).fill({}).map(() => ({
    title: generateRandomTitle(titles),
    createdDate: generateRandomCreatedDate(currentDate),
    announce: generateRandomAnnounce(sentences),
    fullText: generateRandomFullText(sentences),
    category: generateRandomCategory(categories),
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
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_PUBLICATIONS_COUNT;
    try {
      checkCountPublicationsOverflow(countPublications);

      const [sentences, titles, categories] = await Promise.all([
        readContentFromFile(FILE_SENTENCES_PATH),
        readContentFromFile(FILE_TITLES_PATH),
        readContentFromFile(FILE_CATEGORIES_PATH)
      ]);

      const content = generatePublications(countPublications, titles, categories, sentences);
      await writeJsonFile(FILE_NAME, content);
    } catch (err) {
      console.log(chalk.red(err.message));
      throw err;
    }
  }
};
