const express = require("express")
const routinesRouter = express.Router()
const {
  getAllPublicRoutines,
  createRoutine,
  destroyRoutine,
  getRoutineById,
} = require("../db")
const { requireUser } = require("./utils")

// GET /api/routines
routinesRouter.get("/", async (req, res) => {
  const routines = await getAllPublicRoutines()

  res.send(routines)
})

// POST /api/routines

routinesRouter.post("/", requireUser, async (req, res) => {
  const { creatorId, isPublic, name, goal } = req.body

  if (req.user) {
    
  try {
      await createRoutine({ creatorId, isPublic, name, goal })

      res.send({
        creatorId: req.user.id,
        goal,
        isPublic,
        name
      })
    } catch (error) {
      console.log(error)
      throw error
    }
  }
})

// PATCH /api/routines/:routineId

routinesRouter.patch("/:routineId", requireUser, async (req, res) => {
  const { isPublic, name, goal } = req.body

  if (req.user) {
    try {
      const id = req.params.routineId

      const routine = await getRoutineById({ id })
      if (routine.creatorId === req.user.id) {
        const newRoutine = { isPublic, name, goal }
        console.log(newRoutine, "line 49")
        res.send(newRoutine)
      } else {
        res.statusCode = 403

        res.send({
          error: "UnauthorizedToEdit",
          message: "User " + req.user.username + " is not allowed to update Every day",
          name: "Can't Edit This Post"
        })
      }
    } catch (error) {
      console.log(error)
      throw error
    }
  }
})

// DELETE /api/routines/:routineId

routinesRouter.delete("/:routineId", requireUser, async (req, res) => {
  const id = req.params.routineId

  try {
    const routineToBeDeleted = await getRoutineById({ id })
    if (routineToBeDeleted.creatorId === req.user.id) {
      await destroyRoutine(id)
      res.send(routineToBeDeleted)
    } else {
      res.statusCode = 403
      res.send({
        message: `User ${req.user.username} is not allowed to delete On even days`,

        name: "What is this",
        error: "just another day in paradise"
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
})

// POST /api/routines/:routineId/activities

module.exports = routinesRouter
