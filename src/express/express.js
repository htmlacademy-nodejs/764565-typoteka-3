'use strict';

const express = require(`express`);

const offersRoutes = require(`./routes/articles-routes`);
const myRoutes = require(`./routes/my-routes`);
const mainRoutes = require(`./routes/main-routes`);

// Зафиксируем порт для сервера
const DEFAULT_PORT = 8080;

const app = express();

// Подключим созданные маршруты
app.use(`/articles`, offersRoutes);
app.use(`/my`, myRoutes);
app.use(`/`, mainRoutes);

// Запуск сервера
app.listen(DEFAULT_PORT);
