const express = require('express');
const { getAllActivities, createActivity, getActivityById, updateActivity, } = require('../db');
const activitiesRouter = express.Router();
const { requireUser } = require("./utils")

// GET /api/activities/:activityId/routines

// GET /api/activities
activitiesRouter.get('/', async (req, res ) =>{
    const activities = await getAllActivities();
    res.send(activities);
});

// POST /api/activities
activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const {name, description = ""} = req.body;

    const activityData={};

    try{
        activityData.name = name
        activityData.description = description
        activityData.id = req.user.id

        const activity = await createActivity(activityData);

        res.send(activity);

        if (error) {
            res.send({error: "An activity with name Push Ups already exists"})
            
        }
        

    } catch({name, message}) {
        next({name, message});
    }
})


// PATCH /api/activities/:activityId
activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const { activityId } = req.params;
    const { name, description} = req.body;
  
    const updateFields = {};
  
  
    if (name) {
      updateFields.name= name;
    }
  
    if (description) {
      updateFields.description = description;
    }
  
    try {
      const originalActivity = await getActivityById(activityId);
  
      if (originalActivity.id === req.user.id) {
        const updatedActivity = await updateActivity(activityId, updateFields);
        res.send({ activity: updatedActivity })
      } else {
        next({
          name: 'UnauthorizedUserError',
          message: 'You cannot update an activity that is not yours'
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });


module.exports = activitiesRouter;
