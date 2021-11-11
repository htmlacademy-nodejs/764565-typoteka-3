'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const initDB = require(`../../lib/init-db`);
const passwordUtils = require(`../../lib/password`);
const user = require(`./user.route`);
const DataService = require(`./user.service`);
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
const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, articles: mockArticles, users: mockUsers});
  const app = express();
  app.use(express.json());
  user(app, new DataService(mockDB));
  return app;
};

describe(`API creates user if data is valid`, () => {
  const validUserData = {
    firstName: `Сидор`,
    lastName: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
  };

  let response;

  beforeAll(async () => {
    let app = await createAPI();
    response = await request(app)
      .post(`/user`)
      .send(validUserData);
  });

  test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));

});

describe(`API refuses to create user if data is invalid`, () => {
  const validUserData = {
    firstName: `Сидор`,
    lastName: `Сидоров`,
    email: `sidorov@example.com`,
    password: `sidorov`,
    passwordRepeated: `sidorov`,
  };

  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`Empty required property response code is 400`, async () => {
    await request(app)
      .post(`/user`)
      .send({})
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When field type is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, firstName: true},
      {...validUserData, email: 1}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When field value is wrong response code is 400`, async () => {
    const badUsers = [
      {...validUserData, password: `short`, passwordRepeated: `short`},
      {...validUserData, email: `invalid`}
    ];
    for (const badUserData of badUsers) {
      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    }
  });

  test(`When password and passwordRepeated are not equal, code is 400`, async () => {
    const badUserData = {...validUserData, passwordRepeated: `not sidorov`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });

  test(`When email is already in use status code is 400`, async () => {
    const badUserData = {...validUserData, email: `ivanov@example.com`};
    await request(app)
      .post(`/user`)
      .send(badUserData)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe.skip(`API authenticate user if data is valid`, () => {
  const validAuthData = {
    email: `ivanov@example.com`,
    password: `ivanov`
  };

  let response;

  beforeAll(async () => {
    const app = await createAPI();
    response = await request(app)
      .post(`/user/auth`)
      .send(validAuthData);
  });

  test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));

  test(`User name is Иван Иванов`, () => expect(response.body.name).toBe(`Иван Иванов`));
});

describe.skip(`API refuses to authenticate user if data is invalid`, () => {
  let app;

  beforeAll(async () => {
    app = await createAPI();
  });

  test(`If email is incorrect status is 401`, async () => {
    const badAuthData = {
      email: `not-exist@example.com`,
      password: `petrov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });

  test(`If password doesn't match status is 401`, async () => {
    const badAuthData = {
      email: `petrov@example.com`,
      password: `ivanov`
    };
    await request(app)
      .post(`/user/auth`)
      .send(badAuthData)
      .expect(HttpCode.UNAUTHORIZED);
  });
});
