--Заполняем таблицу данными
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar-1.png'),
('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar-2.png');

--Заполняем таблицу данными
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование');

 --Отключаем проверку всех ограничений в таблице чтобы заполнить поле user_id
ALTER TABLE articles DISABLE TRIGGER ALL;
 --Заполняем таблицу данными
INSERT INTO articles(title, announce, description, picture, user_id) VALUES
('Ёлки. История деревьев', 'Если хотите сэкономить, не забывайте заглядывать на нижние полки.', 'Ходите в магазин без детей и смартфона. И тренируйтесь считать в уме. Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев.', 'forest@1x.jpg', 1),
('Борьба с прокрастинацией', 'Если вы действительно отнесетесь к этому заданию серьезно, то оно может занять у нас несколько дней или даже месяцев. На продукты мы ежемесячно тратим около 30% заработка.', 'Ходите в магазин без детей и смартфона. И тренируйтесь считать в уме.', 'sea-fullsize@1x.jpg', 2);
 --Вкючаем проверку всех ограничений в таблице
ALTER TABLE articles ENABLE TRIGGER ALL;

 --Отключаем проверку всех ограничений в таблице чтобы заполнить поля article_id, category_id
ALTER TABLE article_categories DISABLE TRIGGER ALL;
 --Заполняем таблицу данными
INSERT INTO article_categories(article_id, category_id) VALUES
(1, 1),
(1, 2),
(2, 3),
(2, 2);
 --Вкючаем проверку всех ограничений в таблице
ALTER TABLE article_categories ENABLE TRIGGER ALL;

 --Отключаем проверку всех ограничений в таблице чтобы заполнить поля user_id, article_id
ALTER TABLE comments DISABLE TRIGGER ALL;
 --Заполняем таблицу данными
INSERT INTO COMMENTS(text, user_id, article_id) VALUES
('Это где ж такие красоты?', 2, 1),
('Купи, кому говорю', 1, 1),
('Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 1, 2),
('Не куплю', 2, 2);
 --Вкючаем проверку всех ограничений в таблице
ALTER TABLE comments ENABLE TRIGGER ALL;
