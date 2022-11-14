const express = require("express")
const routinesRouter = express.Router()
const {
  getAllPublicRoutines,
  createRoutine,
  destroyRoutine,
  getRoutineById,
  getRoutineActivitiesByRoutine,
  addActivityToRoutine
} = require("../db")
const { requireUser } = require("./utils")

// GET /api/routines
routinesRouter.get("/", async (req, res) => {
  const routines = await getAllPublicRoutines()

  res.send(routines)
})

// POST /api/routines

routinesRouter.post("/", requireUser, async (req, res) => {
  const { isPublic, name, goal } = req.body
  
  if (req.user) {
    try {
     await createRoutine({ isPublic, name, goal })

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
        name: "UnauthorizedDelete",
        error: "Not the user's routine"
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
})

// POST /api/routines/:routineId/activities

routinesRouter.post("/:routineId/activities", async (req, res) => {
  const { routineId, activityId, count, duration } = req.body
  const id = req.params.routineId

  try {
    const returnedRoutine = await getRoutineActivitiesByRoutine({ id })
    const array = returnedRoutine.map((element) => element.activityId)

    if (!array.includes(activityId)) {
      const newRoutine = await addActivityToRoutine({ activityId, count, duration, routineId })
      res.send(newRoutine)
    } else {
      res.send({
        error: "Already Exists",
        message: `Activity ID ${activityId} already exists in Routine ID ${id}`,
        name: "Activity Already Exists in Routine"
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
})

module.exports = routinesRouter
