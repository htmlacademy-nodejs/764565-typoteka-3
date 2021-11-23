'use strict';
const {checkAdminRole} = require(`../../utils`);

module.exports = (req, res, next) => {
  const {user} = req.session;

  if (checkAdminRole(user)) {
    return next();
  }

  return res.redirect(`/login`);
};
