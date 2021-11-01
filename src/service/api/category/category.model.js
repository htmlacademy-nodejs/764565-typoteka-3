'use strict';
const sequelize = require(`../../sequelize`);
const {DataTypes, Model} = require(`sequelize`);

class Category extends Model {}

module.exports = Category.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize.getInstance(),
  modelName: `Category`,
  tableName: `categories`
});

module.exports = Category;
