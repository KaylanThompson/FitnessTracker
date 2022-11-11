const express = require("express")
const usersRouter = express.Router()
const jwt = require("jsonwebtoken")
// const { token } = require("morgan")
const { JWT_SECRET } = process.env

const { getUserByUsername, createUser, getPublicRoutinesByUser, getUserById } = require("../db")

const { requireUser } = require("./utils")

// POST /api/users/login

usersRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body

  try {
    const user = await getUserByUsername(username)

    if (user.password == password) {
      console.log("why is this not working?")
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username
      },
      JWT_SECRET
    )

    res.send({
      token: token,
      message: "you're logged in!",
      user: {
        id: user.id,
        username: user.username
      }
    })
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

    const user = await createUser({ username, password })

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
      user: { id: user.id, username: username }
    })
  } catch ({ name, message }) {
    next({ name, message })
  }
})

// GET /api/users/me

usersRouter.get("/me", async (req, res, next) => {

  if (!req.user){
    res.statusCode = 401
    res.send({
      error: "This is an error",
      message: "You must be logged in to perform this action",
      name: "Unauthorized Error"
    })
  }

  try {
    await getUserById(req.user.id)

    res.send({
      id: req.user.id,
      username: req.user.username
    })
  } catch ({ name, message }) {
    next({ name, message })
  }
})

// GET /api/users/:username/routines

usersRouter.get("/:username/routines", async (req, res, next) => {
  try {
    const user = await getPublicRoutinesByUser(req.params)
    res.send(user)
  } catch ({ name, message }) {
    next({ name, message })
  }
})

module.exports = usersRouter
