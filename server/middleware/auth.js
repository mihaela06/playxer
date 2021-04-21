const { User } = require("../models/User");

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;

  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true,
      });

    req.token = token;
    req.user = user;
    next();
  });
};

let admin = (req, res, next) => {
  if (req.user.isAdmin === 0)
    return res.json({
      isAdmin: false,
      error: true,
    });

  next();
};

module.exports = { auth, admin };
