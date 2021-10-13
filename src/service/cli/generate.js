'use strict';

const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);

const {
  getRandomInt,
  shuffle,
  writeJsonFile,
  readContentFromFile,
} = require(`../../utils`);

const {
  MAX_ID_LENGTH
} = require(`../../constants`);

const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const DEFAULT_PUBLICATIONS_COUNT = 1;
const MAX_PUBLICATIONS_COUNT = 1000;

const FILE_NAME = `mocks.json`;

const generateRandomId = () => {
  return nanoid(MAX_ID_LENGTH);
};

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

const generateRandomComments = (comments) => {

  const count = getRandomInt(1, comments.length);
  return Array(count).fill({}).map(() => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffle(comments)
      .slice(0, getRandomInt(1, comments.length))
      .join(` `),
  }));
};

const generatePublications = (count, titles, categories, sentences, comments) => {
  const currentDate = new Date();
  return Array(count).fill({}).map(() => ({
    id: generateRandomId(),
    title: generateRandomTitle(titles),
    createdDate: generateRandomCreatedDate(currentDate),
    announce: generateRandomAnnounce(sentences),
    fullText: generateRandomFullText(sentences),
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
  name: `--generate`,
  async run(args) {
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

      const content = generatePublications(countPublications, titles, categories, sentences, comments);
      await writeJsonFile(FILE_NAME, content);
    } catch (err) {
      console.log(chalk.red(err.message));
      throw err;
    }
  }
};
