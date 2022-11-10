const express = require("express")
const usersRouter = express.Router()
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = process.env

const { getUserByUsername, createUser } = require("../db")

// POST /api/users/login

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body

//   if (!username || !password) {
//     next({
//       name: "MissingCredentialsError",
//       message: "Please supply both a username and password"
//     })
//   }

  try {
    const user = await getUserByUsername(username)
    console.log(user)

    if (user.password == password) {

      const token = jwt.sign({
        user: {
            id: user.id,
            username: user.username
        }
    })
      const recoveredData = jwt.verify(token, JWT_SECRET)
      res.send({ message: "you're logged in!"})
      return recoveredData
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect"
      })
    }
  } catch (error) {
    console.log(error)
    next(error)
  }
})

// POST /api/users/register

usersRouter.post("/register", async (req, res, next) => {
  const { username, password } = req.body

  try {
    const _user = await getUserByUsername(username)

    if (_user) {
      res.send({
        error: "UserExistsError",
        name: "The User Exists",
        message: "User " + username + " is already taken."

      })
    }

    if (password.length < 8) {
        res.send({
            error: "TooShortPassword",
            name: "Password Length Error",
            message: "Password Too Short!"
          })

    }

    const user = await createUser({username, password})

    const token = jwt.sign(
      {
        id: user.id,
        username
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w"
      }
    )

    res.send({
      message: "thank you for signing up",
      token: token,
      user: {id: user.id,
      username: username}
    })
  } catch ({ name, message }) {
    next({ name, message })
  }
})

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = usersRouter
