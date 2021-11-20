'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const passwordUtils = require(`../../lib/password`);
const category = require(`./category.route`);
const DataService = require(`./category.service`);
const {HttpCode} = require(`../../../constants`);

const mockCategories = [
  `Без рамки\r`,
  `Рисование\r`,
  `Музыка\r`,
  `Программирование\r`,
  `Экономия\r`
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
    "title": `Рок — это протест\r`,
    "user": `ivanov@example.com`,
    "createdDate": `2021-07-15T07:46:37.155Z`,
    "announce": `Это один из лучших рок-музыкантов.\r Собрать камни бесконечности легко, если вы прирожденный герой.\r Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\r Простые ежедневные упражнения помогут достичь успеха.\r`,
    "fullText": `Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились.\r Ёлки — это не просто красивое дерево. Это прочная древесина.\r Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.\r Если хотите сэкономить, не забывайте заглядывать на нижние полки. Достичь успеха помогут ежедневные повторения.\r Золотое сечение — соотношение двух величин, гармоническая пропорция.\r Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\r Первая большая ёлка была установлена только в 1938 году.\r Как начать действовать? Для начала просто соберитесь.\r Главное - верить и приклаждывать усилия!\r Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами.\r Простые ежедневные упражнения помогут достичь успеха.\r Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\r Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев.\r Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\r Игры и программирование разные вещи. Не стоит идти в программисты, если вам нравятся только игры.\r Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок.\r Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\r Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем.\r Это один из лучших рок-музыкантов.\r Собрать камни бесконечности легко, если вы прирожденный герой.\r Вы можете достичь всего. Стоит только немного постараться и запастись книгами.\r`,
    "category": [
      `Без рамки\r`,
      `Рисование\r`,
    ],
    "comments": [
      {
        "user": `ivanov@example.com`,
        "text": `Плюсую, но слишком много буквы!`
      }
    ]
  },
  {
    "title": `Самый лучший музыкальный альбом этого года\r`,
    "user": `petrov@example.com`,
    "createdDate": `2021-04-15T07:46:37.155Z`,
    "announce": `Простые ежедневные упражнения помогут достичь успеха.\r Золотое сечение — соотношение двух величин, гармоническая пропорция.\r Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев.\r На продукты мы ежемесячно тратим около 30% заработка.\r`,
    "fullText": `Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике.\r Прежде всего, тот факт, что вы решили посвятить свое время улучшению навыков рисования — это уже большое достижение.\r Ёлки — это не просто красивое дерево. Это прочная древесина.\r Дрессировка собак должна быть регулярной, поэтому, прежде чем приступить, самостоятельно составьте план тренировок.\r Из под его пера вышло 8 платиновых альбомов.\r Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле?\r Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.\r Как начать действовать? Для начала просто соберитесь.\r Достичь успеха помогут ежедневные повторения.\r Очень важно не упустить момент и начать дрессировку вовремя.\r Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев.\r Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.\r Этот смартфон — настоящая находка. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете.\r Ходите в магазин без детей и смартфона. И тренируйтесь считать в уме.\r Программировать не настолько сложно, как об этом говорят.\r Он написал больше 30 хитов.\r Чем лучше ведёт себя питомец, тем легче брать его с собой, куда бы вы ни отправились.\r Вы можете достичь всего. Стоит только немного постараться и запастись книгами.\r Реальная задача — регулярно практиковаться с намерением учиться, поэтому не имеет значения с чего вы начнете ваш путь.\r`,
    "category": [
      `Экономия\r`
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

const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});

const app = express();
app.use(express.json());

beforeAll(async () => {
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  category(app, new DataService(mockDB));
});

describe(`API returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 categories`, () => expect(response.body.length).toBe(5));
  test(`Category names are "Без рамки", "Рисование", "Музыка", "Программирование", "Экономия"`,
      () => expect(response.body.map((it) => it.name)).toEqual(
          expect.arrayContaining([`Без рамки\r`, `Рисование\r`, `Музыка\r`, `Программирование\r`, `Экономия\r`])
      )
  );
});

describe(`API creates a category`, () => {
  describe(`API creates a category if data is valid`, () => {
    const newCategory = {
      userId: 2,
      name: `Подушки`
    };

    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/categories/`)
        .send(newCategory);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Returns category created`, () => expect(response.body).toBeDefined());
  });

  describe(`API refuses to create a category when data is invalid, and returns status code 400`, () => {
    test(`API returns status code 400`, () => {
      return request(app)
        .post(`/categories/`)
        .send({})
        .expect(HttpCode.BAD_REQUEST);
    });
  });
});

describe(`API changes category`, () => {
  describe(`API changes existent article`, () => {
    const newCategory = {
      userId: 2,
      name: `Подушки`
    };

    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/categories/2`)
        .send(newCategory);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns changed category`, () => expect(response.body).toBeTruthy());
  });

  describe(`API returns status code 404 when trying to change non-existent category`, () => {
    const validCategory = {
      userId: 2,
      name: `Подушки`
    };

    test(`API returns status code 404`, () => {
      return request(app)
        .put(`/categories/150`)
        .send(validCategory)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  test(`API returns status code 400 when trying to change an category with invalid data`, () => {
    return request(app)
      .put(`/categories/1`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API refuses to delete a category`, () => {
  test(`API deletes used category and returns status code 403 `, () => {
    return request(app)
      .delete(`/categories/1`)
      .expect(HttpCode.FORBIDDEN);
  });

  test(`API refuses to delete non-existent category and returns status code 404`, () => {
    return request(app)
      .delete(`/categories/10`)
      .expect(HttpCode.NOT_FOUND);
  });
});
