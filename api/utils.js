function requireUser(req, res, next) {
    if (!req.user) {
      // res.send({
      //   name: "You must be logged in to perform this action",
      //   message: "You must be logged in to perform this action"
      // });
      res.statusCode = 401

    }
    next();
  }
  

  
  module.exports = {
    requireUser
  }