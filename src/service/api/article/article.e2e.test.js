/* eslint-disable max-nested-callbacks */
'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const passwordUtils = require(`../../lib/password`);
const article = require(`./article.route`);
const DataService = require(`./article.service`);
const CommentService = require(`./comment.service`);

const {HttpCode} = require(`../../../constants`);

const mockCategories = [
  `Без рамки`,
  `Рисование`,
  `Музыка`,
  `Программирование`,
  `Экономия`
];

const mockUsers = [
  {
    firstName: `Иван`,
    lastName: `Иванов`,
    email: `ivanov@example.com`,
    passwordHash: passwordUtils.hashSync(`ivanov`)
  },
  {
    firstName: `Пётр`,
    lastName: `Петров`,
    email: `petrov@example.com`,
    passwordHash: passwordUtils.hashSync(`petrov`)
  }
];

const mockArticles = [
  {
    "title": `Рок — это протест`,
    "user": `ivanov@example.com`,
    "createdDate": `2021-07-15T07:46:37.155Z`,
    "announce": `Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.`,
    "description": `Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Если хотите сэкономить, не забывайте заглядывать на нижние полки. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Главное - верить и приклаждывать усилия! Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "category": [
      `Без рамки`,
      `Рисование`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "title": `Самый лучший музыкальный альбом этого года`,
    "user": `petrov@example.com`,
    "createdDate": `2021-04-15T07:46:37.155Z`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев. На продукты мы ежемесячно тратим около 30% заработка.`,
    "description": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Прежде всего, тот факт, что вы решили посвятить свое время улучшению навыков рисования — это уже большое достижение. Ёлки — это не просто красивое дерево. Это прочная древесина. Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Очень важно не упустить момент и начать дрессировку вовремя. Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ходите в магазин без детей и смартфона. И тренируйтесь считать в уме. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Реальная задача — регулярно практиковаться с намерением учиться, поэтому не имеет значения с чего вы начнете ваш путь.`,
    "category": [
      `Экономия`
    ],
    "comments": [
      {
        "user": `petrov@example.com`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`
      },
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы! Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];


const getInstanceDb = async () => {
  const db = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(db, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  return db;
};

const createAPI = async (articleService = null, commentService = null) => {
  if (!articleService || !commentService) {
    const mockDb = await getInstanceDb();

    articleService = articleService ? articleService : new DataService(mockDb);
    commentService = commentService ? commentService : new CommentService(mockDb);
  }

  const app = express();
  app.use(express.json());
  article(app, articleService, commentService);
  return app;
};


describe(`API returns a list of all articles`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 2 articles`, () => expect(response.body.articles.all.articles.length).toBe(2));
  test(`First article's title equals "Самый лучший музыкальный альбом этого года"`, () => expect(response.body.articles.all.articles[0].title).toBe(`Самый лучший музыкальный альбом этого года`));
});

describe(`API returns an article with given id`, () => {
  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .get(`/articles/1`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Рок — это протест"`, () => expect(response.body.title).toBe(`Рок — это протест`));

});

describe(`API creates an article`, () => {
  describe(`API creates an article if data is valid`, () => {

    const newArticle = {
      title: `Рок — это протест Рок — это протест Рок — это протест Рок — это протест`,
      userId: 1,
      announce: `Это революционный взгляд на жизнь и на людей о революционный взгляд на жизнь и на людей `,
      categories: [1],
      description: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`
    };

    let app;
    let response;

    let dataService;

    beforeAll(async () => {
      const mockDb = await getInstanceDb();
      dataService = new DataService(mockDb);
      app = await createAPI(dataService);
      response = await request(app)
        .post(`/articles`)
        .send(newArticle);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Article's id is defined`, () => expect(response.body.id).toBeDefined());
    test(`Article's data match`, async () => {
      await expect(dataService.findOne({articleId: response.body.id})).resolves.toMatchObject({
        title: `Рок — это протест Рок — это протест Рок — это протест Рок — это протест`
      }
      );
    });

    test(`When field type is wrong response code is 400`, async () => {
      const badArticles = [
        {...newArticle, title: true},
        {...newArticle, categories: `Котики`}
      ];
      for (const badArticle of badArticles) {
        await request(app)
          .post(`/articles`)
          .send({badArticle})
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`API refuses to create an article if data is invalid`, () => {
    const newArticle = {
      title: `Рок — это протест`,
      userId: 1,
      announce: `Это революционный взгляд на жизнь и на людей`,
      description: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
      categories: [1, 2]
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Without any required property response code is 400`, async () => {
      await request(app)
        .post(`/articles`)
        .send({})
        .expect(HttpCode.BAD_REQUEST);
    });

    test(`When field value is wrong response code is 400`, async () => {
      const badArticles = [
        {...newArticle, title: `too short`},
        {...newArticle, categories: []}
      ];
      for (const badArticle of badArticles) {
        await request(app)
          .post(`/articles`)
          .send(badArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });
});

describe(`API changes article`, () => {
  describe(`API changes existent article`, () => {
    const newArticle = {
      title: `Музыка жизни Музыка жизни Музыка жизни Музыка жизни`,
      userId: 1,
      announce: `Это революционный взгляд на жизнь и на людей`,
      description: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
      categories: [1, 2]
    };

    let app;
    let response;
    let dataService;

    beforeAll(async () => {
      const mockDb = await getInstanceDb();
      dataService = new DataService(mockDb);
      app = await createAPI(dataService);
      response = await request(app)
        .put(`/articles/1`)
        .send(newArticle);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns changed article`, () => expect(response.body).toBeTruthy());
    test(`Article is really changed`, async () => {
      await expect(dataService.findOne({articleId: 1})).resolves.toMatchObject({title: `Музыка жизни Музыка жизни Музыка жизни Музыка жизни`});
    });
  });

  describe(`API returns status code 404 when trying to change non-existent article`, () => {
    const validArticle = {
      title: `Это Это Это Это Это Это Это Это Это Это`,
      userId: 1,
      announce: `новая новая новая новая новая новая `,
      description: `валидная`,
      category: [2]
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`API returns status code 404`, () => {
      return request(app)
        .put(`/articles/150`)
        .send(validArticle)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API returns status code 400 when trying to change an article with invalid data`, () => {
    const invalidArticle = {
      title: `Это`,
      userId: 1,
      announce: `невалидно невалидно невалидно невалидно невалидно невалидно`,
      description: `нет category`,
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`API returns status code 400`, () => {
      return request(app)
        .put(`/articles/1`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`API deletes an article`, () => {
  describe(`API correctly deletes an article`, () => {
    let app;
    let response;
    let dataService;

    beforeAll(async () => {
      const mockDb = await getInstanceDb();
      dataService = new DataService(mockDb);
      app = await createAPI(dataService);
      response = await request(app)
        .delete(`/articles/1`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns deleted article`, () => expect(response.body).toBeTruthy());
    test(`Article not exists`, async () => await expect(dataService.findOne({articleId: 1})).resolves.toBeNull());
  });

  describe(`API refuses to delete non-existent article`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`API returns status code 404`, () => {
      return request(app)
        .delete(`/articles/100`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`API returns a list of comments to given article`, () => {
  let app;
  let response;

  beforeAll(async () => {
    app = await createAPI();
    response = await request(app)
      .get(`/articles/2/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));
  test(`First comment's text is "Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!"`,
      () => expect(response.body[0].text).toBe(`Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`));
});

describe(`API creates a comment`, () => {
  describe(`API creates a comment if data is valid`, () => {
    const newComment = {
      userId: 2,
      text: `Валидному комментарию достаточно этого поля`
    };

    let app;
    let response;
    let dataService;
    let commentService;

    beforeAll(async () => {
      const mockDb = await getInstanceDb();
      dataService = new DataService(mockDb);
      commentService = new CommentService(mockDb);
      app = await createAPI(dataService, commentService);
      response = await request(app)
        .post(`/articles/1/comments`)
        .send(newComment);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Returns comment created`, () => expect(response.body).toBeDefined());
    test(`Comments count is changed`, async () => await expect(Object.values(await commentService.findAll(1)).length).toBe(2));
  });

  describe(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`API returns status code 400`, () => {
      return request(app)
        .post(`/articles/1/comments`)
        .send({})
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`API returns status code 404`, async () => {
      return request(app)
        .post(`/articles/100/comments`)
        .send({
          text: `Неважно`
        })
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`API refuses to delete a comment`, () => {
  describe(`API correctly deletes a comment`, () => {
    let app;
    let response;
    let dataService;
    let commentService;

    beforeAll(async () => {
      const mockDb = await getInstanceDb();
      dataService = new DataService(mockDb);
      commentService = new CommentService(mockDb);
      app = await createAPI(dataService, commentService);
      response = await request(app)
        .delete(`/articles/1/comments/1`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Comment is not exists`, async () => await expect(commentService.drop(1)).resolves.toBeFalsy());
  });

  describe(`API refuses to delete non-existent comment`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`API returns status code 404`, () => {
      return request(app)
        .delete(`/articles/1/comments/40`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API refuses to delete a comment to non-existent article`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`API returns status code 404`, () => {
      return request(app)
        .delete(`/articles/100/comments/1`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

