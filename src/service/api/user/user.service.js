'use strict';

const passwordUtils = require(`../../lib/password`);

class UserService {
  constructor(sequelize) {
    this._User = sequelize.models.User;
  }

  async createUser(userData) {
    userData.passwordHash = await passwordUtils.hash(userData.password);
    const userNew = await this._User.create(userData);
    const user = userNew.get();
    delete user.passwordHash;
    return user;
  }

  async findByEmail(email) {
    const user = await this._User.findOne({
      where: {email}
    });
    return user && user.get();
  }

  async compareHash(password, passwordHash) {
    return await passwordUtils.compare(password, passwordHash);
  }

}

module.exports = UserService;
