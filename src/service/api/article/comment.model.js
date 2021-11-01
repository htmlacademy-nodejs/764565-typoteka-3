'use strict';

const {DataTypes, Model} = require(`sequelize`);
const sequelize = require(`../../sequelize`);
class Comment extends Model {}

Comment.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize.getInstance(),
  modelName: `Comment`,
  tableName: `comments`,
});

module.exports = Comment;
