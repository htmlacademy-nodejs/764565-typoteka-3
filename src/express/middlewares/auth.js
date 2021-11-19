'use strict';
const userAdmin = require(`../../constants`);

module.exports = (req, res, next) => {
  const {user} = req.session;
  console.log(user);
  console.log(userAdmin.Admin);

  if (user && user.id === userAdmin.ADMIN.userId) {
    return next();
  }
  return res.redirect(`/login`);
};
