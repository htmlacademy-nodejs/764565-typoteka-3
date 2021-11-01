'use strict';

const {DataTypes, Model} = require(`sequelize`);
const sequelize = require(`../../sequelize`);

class Article extends Model {}

module.exports = Article.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  announce: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    // Можно воспользоваться скобочной нотацией:
    // type: DataTypes[STRING](1000)
    // eslint-disable-next-line new-cap
    type: DataTypes.STRING(1000)
  },
  picture: DataTypes.STRING
},
{
  sequelize: sequelize.getInstance(),
  modelName: `Article`,
  tableName: `articles`,
});

module.exports = Article;
