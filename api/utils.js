function requireUser(req, res, next) {
  if (!req.user){
    res.statusCode = 401
    res.send({
      error: "This is an error",
      message: "You must be logged in to perform this action",
      name: "Unauthorized Error"
    })
  }
    next();
  }
  

  
  module.exports = {
    requireUser
  }