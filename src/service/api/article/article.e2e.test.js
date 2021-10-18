'use strict';

const express = require(`express`);
const request = require(`supertest`);

const article = require(`./article.route`);
const DataService = require(`./article.service`);
const CommentService = require(`./comment.service`);

const {
  HttpCode,
} = require(`../../../constants`);

const mockData = [
  {
    "id": `CFDzl8`,
    "title": `Рок — это протест\r`,
    "createdDate": `2021-07-15T07:46:37.155Z`,
    "announce": `Это один из лучших рок-музыкантов.\r Собрать камни бесконечности легко, если вы прирожденный герой.\r Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\r Простые ежедневные упражнения помогут достичь успеха.\r`,
    "fullText": `Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились.\r Ёлки — это не просто красивое дерево. Это прочная древесина.\r Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.\r Если хотите сэкономить, не забывайте заглядывать на нижние полки. Достичь успеха помогут ежедневные повторения.\r Золотое сечение — соотношение двух величин, гармоническая пропорция.\r Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\r Первая большая ёлка была установлена только в 1938 году.\r Как начать действовать? Для начала просто соберитесь.\r Главное - верить и приклаждывать усилия!\r Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.\r Простые ежедневные упражнения помогут достичь успеха.\r Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\r Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев.\r Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\r Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.\r Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок.\r Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\r Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.\r Это один из лучших рок-музыкантов.\r Собрать камни бесконечности легко, если вы прирожденный герой.\r Вы можете достичь всего. Стоит только немного постараться и запастись книгами.\r`,
    "category": [
      `Без рамки\r`,
      `Рисование\r`,
      `Музыка\r`,
      `Экономия`,
      `Программирование\r`,
      `Хобби\r`
    ],
    "comments": [
      {
        "id": `4o2MtL`,
        "text": `Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "id": `RnjHT8`,
    "title": `Самый лучший музыкальный альбом этого года\r`,
    "createdDate": `2021-04-15T07:46:37.155Z`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха.\r Золотое сечение — соотношение двух величин, гармоническая пропорция.\r Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев.\r На продукты мы ежемесячно тратим около 30% заработка.\r`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.\r Прежде всего, тот факт, что вы решили посвятить свое время улучшению навыков рисования — это уже большое достижение.\r Ёлки — это не просто красивое дерево. Это прочная древесина.\r Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок.\r Из под его пера вышло 8 платиновых альбомов.\r Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\r Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\r Как начать действовать? Для начала просто соберитесь.\r Достичь успеха помогут ежедневные повторения.\r Очень важно не упустить момент и начать дрессировку вовремя.\r Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев.\r Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\r Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\r Ходите в магазин без детей и смартфона. И тренируйтесь считать в уме.\r Программировать не настолько сложно, как об этом говорят.\r Он написал больше 30 хитов.\r Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились.\r Вы можете достичь всего. Стоит только немного постараться и запастись книгами.\r Реальная задача — регулярно практиковаться с намерением учиться, поэтому не имеет значения с чего вы начнете ваш путь.\r`,
    "category": [
      `Радио\r`,
      `Экономия\r`
    ],
    "comments": [
      {
        "id": `zmgiza`,
        "text": `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Согласен с автором! Хочу такую же футболку :-) Совсем немного... Мне кажется или я уже читал это где-то? Это где ж такие красоты? Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`
      },
      {
        "id": `9nkHOd`,
        "text": `Плюсую, но слишком много буквы! Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Это где ж такие красоты? Планируете записать видосик на эту тему? Согласен с автором! Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ]
  }
];

const cloneData = JSON.parse(JSON.stringify(mockData));

const createAPI = (services = [new DataService(cloneData), new CommentService()]) => {
  const app = express();
  app.use(express.json());
  article(app, ...services);
  return app;
};

describe(`API returns a list of all articles`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns a list of 2 articles`, () => expect(response.body.length).toBe(2));
  test(`First article's id equals "CFDzl8"`, () => expect(response.body[0].id).toBe(`CFDzl8`));
});

describe(`API returns an article with given id`, () => {

  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/CFDzl8`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article's title is "Рок — это протест"`, () => expect(response.body.title).toBe(`Рок — это протест\r`));

});

describe(`API creates an article`, () => {
  describe(`API creates an article if data is valid`, () => {

    const newArticle = {
      title: `Влияние воды на людей`,
      announce: `Это революционный взгляд на жизнь и на людей`,
      fullText: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
      category: `Наука`
    };

    const dataService = new DataService(cloneData);
    const commentService = new CommentService();
    const app = createAPI([dataService, commentService]);
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/articles`)
        .send(newArticle);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Returns article created`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
    test(`Article's id is defined`, () => expect(response.body.id).toBeDefined());
    test(`Article's data match`, () => {
      expect(dataService.findOne(response.body.id)).toMatchObject({
        title: `Влияние воды на людей`,
        announce: `Это революционный взгляд на жизнь и на людей`,
        fullText: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
        category: `Наука`
      }
      );
    });
  });

  describe(`API refuses to create an article if data is invalid`, () => {
    const newArticle = {
      title: `Влияние воды на людей`,
      announce: `Это революционный взгляд на жизнь и на людей`,
      fullText: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
      category: `Наука`
    };

    const app = createAPI();

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

describe(`API changes article`, () => {
  describe(`API changes existent article`, () => {
    const newArticle = {
      title: `Влияние воды на людей`,
      announce: `Это революционный взгляд на жизнь и на людей`,
      fullText: `Таких масштабных экспериментов ещё не было! Научный мир до сих пор спорит и полученных результатах`,
      category: `Наука`
    };

    const dataService = new DataService(cloneData);
    const commentService = new CommentService();
    const app = createAPI([dataService, commentService]);

    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/articles/CFDzl8`)
        .send(newArticle);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
    test(`Article is really changed`, () => {
      expect((dataService.findOne(response.body.id)).title).toBe(`Влияние воды на людей`);
    });
  });

  describe(`API returns status code 404 when trying to change non-existent article`, () => {
    const app = createAPI();

    const validArticle = {
      title: `Это`,
      announce: `новая`,
      fullText: `валидная`,
      category: `статья`
    };

    test(`API returns status code 404`, () => {
      return request(app)
        .put(`/articles/NOEXST`)
        .send(validArticle)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API returns status code 400 when trying to change an article with invalid data`, () => {
    const app = createAPI();

    const invalidArticle = {
      title: `Это`,
      announce: `невалидно`,
      fullText: `нет category`,
    };
    test(`API returns status code 400`, () => {
      return request(app)
        .put(`/articles/NOEXST`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });

  });

});

describe(`API deletes an article`, () => {
  describe(`API correctly deletes an article`, () => {
    const dataService = new DataService(cloneData);
    const commentService = new CommentService();
    const app = createAPI([dataService, commentService]);

    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/articles/CFDzl8`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns deleted article`, () => expect(response.body.id).toBe(`CFDzl8`));
    test(`Article not exists`, () => expect(dataService.findOne(response.body.id)).toBeFalsy());
  });

  describe(`API refuses to delete non-existent article`, () => {
    const app = createAPI();

    test(`API returns status code 404`, () => {
      return request(app)
        .delete(`/articles/NOEXST`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});


describe(`API returns a list of comments to given article`, () => {
  const app = createAPI();

  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/RnjHT8/comments`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 2 comments`, () => expect(response.body.length).toBe(2));
  test(`First comment's id is "zmgiza"`, () => expect(response.body[0].id).toBe(`zmgiza`));
});

describe(`API creates a comment`, () => {
  describe(`API creates a comment if data is valid`, () => {
    const newComment = {
      text: `Валидному комментарию достаточно этого поля`
    };
    const dataService = new DataService(cloneData);
    const commentService = new CommentService();
    const app = createAPI([dataService, commentService]);

    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/articles/RnjHT8/comments`)
        .send(newComment);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Returns comment created`, () => expect(response.body).toEqual(expect.objectContaining(newComment)));
    test(`Comments count is changed`, () => expect(commentService.findAll(dataService.findOne(`RnjHT8`)).length).toBe(3));
  });

  describe(`API refuses to create a comment when data is invalid, and returns status code 400`, () => {
    const app = createAPI();

    test(`API returns status code 400`, () => {
      return request(app)
        .post(`/articles/RnjHT8/comments`)
        .send({})
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API refuses to create a comment to non-existent article and returns status code 404`, () => {
    const app = createAPI();

    test(`API returns status code 404`, () => {
      return request(app)
        .post(`/articles/NOEXST/comments`)
        .send({
          text: `Неважно`
        })
        .expect(HttpCode.NOT_FOUND);
    });
  });
});

describe(`API refuses to delete a comment`, () => {
  describe(`API correctly deletes a comment`, () => {
    const dataService = new DataService(cloneData);
    const commentService = new CommentService();
    const app = createAPI([dataService, commentService]);

    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/articles/RnjHT8/comments/9nkHOd`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns comment deleted`, () => expect(response.body.id).toBe(`9nkHOd`));
    test(`Comment is not exists`, () => expect((commentService.drop(dataService.findOne(`RnjHT8`), `9nkHOd`))).toBeNull());
  });

  describe(`API refuses to delete non-existent comment`, () => {
    const app = createAPI();

    test(`API returns status code 404`, () => {
      return request(app)
        .delete(`/articles/CFDzl8/comments/NOEXST`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API refuses to delete a comment to non-existent article`, () => {
    const app = createAPI();

    test(`API returns status code 404`, () => {
      return request(app)
        .delete(`/articles/NOEXST/comments/4o2MtL`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

});
