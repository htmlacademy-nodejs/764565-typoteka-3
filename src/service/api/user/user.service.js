'use strict';

const passwordUtils = require(`../../lib/password`);

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async create(userData) {
    const user = await this._User.create(userData);
    return user.get();
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });
    return user && user.get();
  }

  async createHash(userData) {
    userData.passwordHash = await passwordUtils.hash(userData.password);
    return userData;
  }

}

module.exports = UserService;
