const express = require('express');
const routineActivitiesRouter = express.Router();
const {requireUser} = require("./utils")
const { destroyRoutineActivity, getRoutineActivityById, getRoutineById} = require("../db")

// PATCH /api/routine_activities/:routineActivityId

// DELETE /api/routine_activities/:routineActivityId

routineActivitiesRouter.delete ("/:routineActivityId", requireUser, async (req, res) => {
 

    const id = req.params.routineActivityId
    // const {id} = req.body
    console.log(id)
    
    
    if(req.user) {
    
    try {
      const routine = await getRoutineById({id})
      if (req.user.id === routine.creatorId) {
          const routineToBeDeleted = await destroyRoutineActivity(id)
          res.send(routineToBeDeleted)

            
      } else {
            
            
            res.send({
                message: `User ${req.user.username} is not allowed to delete ${routine.name}`,
                name: "What is this",
                error: "just another day in paradise"
            })
        }
    } catch (error) {
      console.log(error)
      throw error}
    }
})




module.exports = routineActivitiesRouter;
