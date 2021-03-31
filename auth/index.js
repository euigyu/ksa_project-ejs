const jwt = require("jsonwebtoken");

module.exports = {
  checkToken: (req, res, next, callback) => {
    let token = req.cookies.token
    console.log(token);
    if (token) {
      jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
          console.log(err);
          return callback(false)
        } else {
          req.decoded = decoded;
          return callback(true)
        }
      });
    } else {
      return callback(false)
    }
  }
};