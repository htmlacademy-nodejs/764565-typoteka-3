'use strict';

const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle,
  writeJsonFile,
  readContentFromFile,
} = require(`../../utils`);


const FILE_PATH = {
  SENTENCES: `./data/sentences.txt`,
  TITLES: `./data/titles.txt`,
  CATEGORIES: `./data/categories.txt`,
  COMMENTS: `./data/comments.txt`
};
const DEFAULT_PUBLICATIONS_COUNT = 1;
const MAX_CATEGORIES = 4;
const FILE_NAME = `fill-db-auto.sql`;

const generateRandomTitle = (titles) => {
  return titles[getRandomInt(0, titles.length - 1)];
};

const generateRandomAnnounce = (sentences) => {
  return shuffle(sentences).slice(0, 4).join(` `);
};

const generateRandomFullText = (sentences) => {
  return shuffle(sentences).slice(0, getRandomInt(0, sentences.length - 1)).join(` `);
};

const generateRandomCategory = (categories) => {
  return shuffle(categories).slice(0, getRandomInt(0, MAX_CATEGORIES));
};

const generateRandomComments = (articleId, userCount, comments) => {
  const count = getRandomInt(1, comments.length);
  return Array(count).fill({}).map(() => ({
    userId: getRandomInt(1, userCount),
    articleId,
    text: shuffle(comments)
      .slice(0, getRandomInt(1, 3))
      .join(` `),
  }));
};

const generatePublications = (count, titles, categories, userCount, sentences, comments) => (
  Array(count).fill({}).map((_, index) => ({
    title: generateRandomTitle(titles),
    announce: generateRandomAnnounce(sentences),
    description: generateRandomFullText(sentences),
    category: generateRandomCategory(categories),
    comments: generateRandomComments(index + 1, userCount, comments),
    userId: getRandomInt(1, userCount)
  }))
);

module.exports = {
  name: `--fill`,
  async run(args) {

    const [sentences, titles, categories, commentSentences] = await Promise.all([
      readContentFromFile(FILE_PATH.SENTENCES),
      readContentFromFile(FILE_PATH.TITLES),
      readContentFromFile(FILE_PATH.CATEGORIES),
      readContentFromFile(FILE_PATH.COMMENTS)
    ]);

    const [count] = args;
    const countPublications = Number.parseInt(count, 10) || DEFAULT_PUBLICATIONS_COUNT;

    const users = [
      {
        email: `sidorov@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Игнат`,
        lastName: `Юрьевич`,
        avatar: `avatar-3.png`
      }, {
        email: `natav@example.com`,
        passwordHash: `5f4dcc3b5aa765d61d8327deb882cf99`,
        firstName: `Наталья`,
        lastName: `Викторовна`,
        avatar: `avatar-4.png`
      }
    ];

    const articles = generatePublications(countPublications, titles, categories, users.length, sentences, commentSentences);

    const categoryValues = categories.map((name) => `('${name}')`).join(`,\n`);

    const comments = articles.flatMap((article) => article.comments);
    const articleCategories = articles.map((article, index) => ({articleId: index + 1, categoryId: categories.indexOf(article.category[0]) + 1}));

    const userValues = users.map(
        ({email, passwordHash, firstName, lastName, avatar}) =>
          `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`
    ).join(`,\n`);

    const articleValues = articles.map(
        ({title, announce, description, picture, userId}) =>
          `('${title}', '${announce}', '${description}', '${picture}', ${userId})`
    ).join(`,\n`);

    const articleCategoryValues = articleCategories.map(
        ({articleId, categoryId}) =>
          `(${articleId}, ${categoryId})`
    ).join(`,\n`);

    const commentValues = comments.map(
        ({text, userId, articleId}) =>
          `('${text}', ${userId}, ${articleId})`
    ).join(`,\n`);

    const content = `
  INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
  ${userValues};
  INSERT INTO categories(name) VALUES
  ${categoryValues};
  ALTER TABLE articles DISABLE TRIGGER ALL;
  INSERT INTO articles(title, announce, description, picture, user_Id) VALUES
  ${articleValues};
  ALTER TABLE articles ENABLE TRIGGER ALL;
  ALTER TABLE article_categories DISABLE TRIGGER ALL;
  INSERT INTO article_categories(article_id, category_id) VALUES
  ${articleCategoryValues};
  ALTER TABLE article_categories ENABLE TRIGGER ALL;
  ALTER TABLE comments DISABLE TRIGGER ALL;
  INSERT INTO COMMENTS(text, user_id, article_id) VALUES
  ${commentValues};
  ALTER TABLE comments ENABLE TRIGGER ALL;`;

    try {
      await writeJsonFile(FILE_NAME, content);
    } catch (err) {
      console.log(chalk.red(err.message));
      throw err;
    }
  }
};
