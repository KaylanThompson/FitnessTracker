const express = require("express")
const routineActivitiesRouter = express.Router()
const { requireUser } = require("./utils")
const {
  destroyRoutineActivity,
  getRoutineActivityById,
  getRoutineById,
  updateRoutineActivity
} = require("../db")

// PATCH /api/routine_activities/:routineActivityId

routineActivitiesRouter.patch("/:routineActivityId", requireUser, async (req, res) => {
  const id = req.params.routineActivityId
  const { count, duration } = req.body

  try {
    const routineActivity = await getRoutineActivityById(id)

    const routine = await getRoutineById({ id: routineActivity.routineId })
    if (req.user.id == routine.creatorId) {
      const toUpdate = await updateRoutineActivity({ id, count, duration })
      res.send(toUpdate)
    } else {
      res.statusCode = 403
      res.send({
        message: `User ${req.user.username} is not allowed to update ${routine.name}`,
        name: "Unauthorized to update",
        error: "Unauthorized to update."
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
})

// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete("/:routineActivityId", requireUser, async (req, res) => {
  const id = req.params.routineActivityId

  try {
    const routineActivity = await getRoutineActivityById(id)

    const routine = await getRoutineById({ id: routineActivity.routineId })

    if (req.user.id == routine.creatorId) {
      const routineToBeDeleted = await destroyRoutineActivity(id)
      res.send(routineToBeDeleted)
    } else {
      res.statusCode = 403
      res.send({
        message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
        name: "Unauthorized to Delete",
        error: "Unauthorized user can't delete."
      })
    }
  } catch (error) {
    console.log(error)
    throw error
  }
})

module.exports = routineActivitiesRouter
