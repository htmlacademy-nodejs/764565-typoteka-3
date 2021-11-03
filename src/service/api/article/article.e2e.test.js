/*eslint max-nested-callbacks: ["error", 10]*/
'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
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

const mockArticles = [
  {
    "title": `Рок — это протест`,
    "createdDate": `2021-07-15T07:46:37.155Z`,
    "announce": `Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Простые ежедневные упражнения помогут достичь успеха.`,
    "fullText": `Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились. Ёлки — это не просто красивое дерево. Это прочная древесина. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Если хотите сэкономить, не забывайте заглядывать на нижние полки. Достичь успеха помогут ежедневные повторения. Золотое сечение — соотношение двух величин, гармоническая пропорция. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Главное - верить и приклаждывать усилия! Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Простые ежедневные упражнения помогут достичь успеха. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры. Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Это один из лучших рок-музыкантов. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Стоит только немного постараться и запастись книгами.`,
    "category": [
      `Без рамки`,
      `Рисование`,
    ],
    "comments": [
      {
        "text": `Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "title": `Самый лучший музыкальный альбом этого года`,
    "createdDate": `2021-04-15T07:46:37.155Z`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция. Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев. На продукты мы ежемесячно тратим около 30% заработка.`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Прежде всего, тот факт, что вы решили посвятить свое время улучшению навыков рисования — это уже большое достижение. Ёлки — это не просто красивое дерево. Это прочная древесина. Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок. Из под его пера вышло 8 платиновых альбомов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Как начать действовать? Для начала просто соберитесь. Достичь успеха помогут ежедневные повторения. Очень важно не упустить момент и начать дрессировку вовремя. Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Ходите в магазин без детей и смартфона. И тренируйтесь считать в уме. Программировать не настолько сложно, как об этом говорят. Он написал больше 30 хитов. Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Реальная задача — регулярно практиковаться с намерением учиться, поэтому не имеет значения с чего вы начнете ваш путь.`,
    "category": [
      `Экономия`
    ],
    "comments": [
      {
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`
      },
      {
        "text": `Плюсую, но слишком много буквы! Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const createAPI = async (articleService = new DataService(mockDB), commentService = new CommentService(mockDB)) => {
  const app = express();
  app.use(express.json());
  article(app, articleService, commentService);
  return app;
};

// describe(`API returns a list of all articles`, () => {
//   let response;

//   beforeAll(async () => {
//     const app = await createAPI();
//     response = await request(app)
//       .get(`/articles`);
//   });

//   test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//   test(`Returns a list of 2 articles`, () => expect(response.body.length).toBe(2));
//   test(`First article's title equals "Самый лучший музыкальный альбом этого года"`, () => expect(response.body[0].title).toBe(`Самый лучший музыкальный альбом этого года`));
// });

// describe(`API returns an article with given id`, () => {
//   let response;

//   beforeAll(async () => {
//     const app = await createAPI();
//     response = await request(app)
//       .get(`/articles/1`);
//   });

//   test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//   test(`Article's title is "Рок — это протест"`, () => expect(response.body.title).toBe(`Рок — это протест`));

// });

describe(``, () => {
  beforeEach(async () => {
    const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
    await initDB(mockDB, {categories: mockCategories, articles: mockArticles});
  });

  describe(`API creates an article`, () => {
    describe(`API creates an article if data is valid`, () => {

      const newArticle = {
        title: `Рок — это протест`,
        announce: `Это революционный взгляд на жизнь и на людей`,
        category: [1],
        fullText: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`
      };

      let app;
      let response;
 
      let dataService;

      beforeAll(async () => {
        dataService = new DataService(mockDB);
        app = await createAPI(dataService);
        response = await request(app)
          .post(`/articles`)
          .send(newArticle);
      });
  
  
      test(`Status code 201`, async () => await expect(response.statusCode).toBe(HttpCode.CREATED));
      test(`Article's id is defined`, () => expect(response.body.id).toBeDefined());
      test(`Article's data match`, async () => {
        await expect(dataService.findOne(response.body.id)).resolves.toMatchObject({
          title: `Рок — это протест`
        }
        );
      });
    });
  
    describe(`API refuses to create an article if data is invalid`, () => {
      const newArticle = {
        title: `Рок — это протест`,
        announce: `Это революционный взгляд на жизнь и на людей`,
        fullText: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
        category: [1, 2]
      };
  
      let app;
  
      beforeAll(async () => {
        app = await createAPI();
      });
  
      test(`Without any required property response code is 400`, async () => {
        for (const key of Object.keys(newArticle)) {
          const badArticle = {...newArticle};
          delete badArticle[key];
          await request(app)
            .post(`/articles`)
            .send(badArticle)
            .expect(HttpCode.BAD_REQUEST);
        }
      });
    });
  });

});



// describe(`API changes article`, () => {
//   describe(`API changes existent article`, () => {
//     const newArticle = {
//       title: `Музыка жизни`,
//       announce: `Это революционный взгляд на жизнь и на людей`,
//       fullText: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
//       category: [1, 2]
//     };

//     let app;
//     let response;

//     beforeAll(async () => {
//       app = await createAPI();
//       response = await request(app)
//         .put(`/articles/1`)
//         .send(newArticle);
//     });

//     test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//     test(`Returns changed article`, () => expect(response.body).toBeTruthy());
//     /*test(`Article is really changed`, () => {
//       expect((dataService.findOne(response.body.id)).title).toBe(`Влияние воды на людей`);
//     });*/
//   });

//   describe(`API returns status code 404 when trying to change non-existent article`, () => {
//     const validArticle = {
//       title: `Это`,
//       announce: `новая`,
//       fullText: `валидная`,
//       category: [2]
//     };

//     let app;

//     beforeAll(async () => {
//       app = await createAPI();
//     });

//     test(`API returns status code 404`, () => {
//       return request(app)
//         .put(`/articles/150`)
//         .send(validArticle)
//         .expect(HttpCode.NOT_FOUND);
//     });
//   });

//   describe(`API returns status code 400 when trying to change an article with invalid data`, () => {
//     const invalidArticle = {
//       title: `Это`,
//       announce: `невалидно`,
//       fullText: `нет category`,
//     };

//     let app;

//     beforeAll(async () => {
//       app = await createAPI();
//     });

//     test(`API returns status code 400`, () => {
//       return request(app)
//         .put(`/articles/100`)
//         .send(invalidArticle)
//         .expect(HttpCode.BAD_REQUEST);
//     });

//   });

// });

// describe(`API deletes an article`, () => {
//   describe(`API correctly deletes an article`, () => {
//     let app;
//     let response;

//     beforeAll(async () => {
//       app = await createAPI();
//       response = await request(app)
//         .delete(`/articles/1`);
//     });

//     test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//     test(`Returns deleted article`, () => expect(response.body).toBeTruthy());
//     //test(`Article not exists`, () => expect(dataService.findOne(response.body.id)).toBeFalsy());
//   });

//   describe(`API refuses to delete non-existent article`, () => {
//     let app;

//     beforeAll(async () => {
//       app = await createAPI();
//     });

//     test(`API returns status code 404`, () => {
//       return request(app)
//         .delete(`/articles/100`)
//         .expect(HttpCode.NOT_FOUND);
//     });
//   });
// });


// describe(`API returns a list of comments to given article`, () => {
//   let app;
//   let response;

//   beforeAll(async () => {
//     app = await createAPI();
//     response = await request(app)
//       .get(`/articles/2/comments`);
//   });

//   test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//   test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));
//   test(`First comment's text is "Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!"`,
//       () => expect(response.body[0].text).toBe(`Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`));
// });

// describe(`API creates a comment`, () => {
//   describe(`API creates a comment if data is valid`, () => {
//     const newComment = {
//       text: `Валидному комментарию достаточно этого поля`
//     };
//     /*const dataService = new DataService(cloneData);
//     const commentService = new CommentService();
//     const app = createAPI([dataService, commentService]);*/

//     let app;
//     let response;

//     beforeAll(async () => {
//       app = await createAPI();
//       response = await request(app)
//         .post(`/articles/1/comments`)
//         .send(newComment);
//     });

//     test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
//     test(`Returns comment created`, () => expect(response.body).toBeDefined());
//     //test(`Comments count is changed`, () => expect(commentService.findAll(dataService.findOne(`RnjHT8`)).length).toBe(3));
//   });

//   describe(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
//     let app;

//     beforeAll(async () => {
//       app = await createAPI();
//     });

//     test(`API returns status code 400`, () => {
//       return request(app)
//         .post(`/articles/1/comments`)
//         .send({})
//         .expect(HttpCode.BAD_REQUEST);
//     });
//   });

//   describe(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
//     let app;

//     beforeAll(async () => {
//       app = await createAPI();
//     });

//     test(`API returns status code 404`, async () => {
//       return request(app)
//         .post(`/articles/100/comments`)
//         .send({
//           text: `Неважно`
//         })
//         .expect(HttpCode.NOT_FOUND);
//     });
//   });
// });

// describe(`API refuses to delete a comment`, () => {
//   describe(`API correctly deletes a comment`, () => {
//     /*const dataService = new DataService(cloneData);
//     const commentService = new CommentService();
//     const app = createAPI([dataService, commentService]);*/
//     let app;
//     let response;

//     beforeAll(async () => {
//       app = await createAPI();
//       response = await request(app)
//         .delete(`/articles/1/comments/1`);
//     });

//     test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
//     //test(`Comment is not exists`, () => expect((commentService.drop(dataService.findOne(`RnjHT8`), `9nkHOd`))).toBeNull());
//   });

//   describe(`API refuses to delete non-existent comment`, () => {
//     let app;

//     beforeAll(async () => {
//       app = await createAPI();
//     });

//     test(`API returns status code 404`, () => {
//       return request(app)
//         .delete(`/articles/1/comments/40`)
//         .expect(HttpCode.NOT_FOUND);
//     });
//   });

//   describe(`API refuses to delete a comment to non-existent article`, () => {
//     let app;

//     beforeAll(async () => {
//       app = await createAPI();
//     });

//     test(`API returns status code 404`, () => {
//       return request(app)
//         .delete(`/articles/100/comments/1`)
//         .expect(HttpCode.NOT_FOUND);
//     });
//   });
// });