const express = require('express');
const { getAllActivities, createActivity, getActivityById, updateActivity, getActivityByName, getPublicRoutinesByActivity} = require('../db');
const activitiesRouter = express.Router();
const { requireUser } = require("./utils")

// GET /api/activities
activitiesRouter.get('/', async (req, res ) =>{
    const activities = await getAllActivities();
    res.send(activities);
});

// GET /api/activities/:activityId/routines
activitiesRouter.get('/:activityId/routines', async (req, res, next) => {
    // const {req.params} = req.body
    const id = req.params.activityId
    console.log(id, "this is id line 10")

    try {
        const activity = await getActivityById(id)
        console.log(activity, 'this dont work')
        if(!activity){
            res.send({error:"this has failed", message:`Activity ${id} not found`, name: " bob"})
        }
        const routine = await getPublicRoutinesByActivity(activity)
        res.send(routine)
    } catch (error) {
        console.log(error)
        throw error
    }
})


// POST /api/activities
activitiesRouter.post('/', requireUser, async (req, res, next) => {
    const {name, description} = req.body
    const activityData = {name, description};
    try{
        const activity = await getActivityByName(name)
        if (activity) {
            res.send({error: "string", message:`An activity with name ${name} already exists`, name: "string"})
        }

        const newActivity = await createActivity(activityData);

        res.send(newActivity);
        

    } catch({name, message}) {
        next({name, message});
    }
})


    



// PATCH /api/activities/:activityId

activitiesRouter.patch('/:activityId', requireUser, async (req, res, next) => {
    const {activityId} = req.params;
    const {name, description} = req.body;

    const updateFields = {};

    if (name) {
        updateFields.name = name;
    }
    if (description) {
        updateFields.description = description;
    }

    try{
        const oldActivity = await getActivityById(activityId);

        if (oldActivity.name.id === req.user.id) {
            const updateActivity = await updateActivity(activityId, updateFields)
            res.send({activity: updateActivity})
        } else{
            next({
                name: '',
                message:''
            })
        }
    } catch ({ name, message}) {
        next({ name, message });
    }

})


module.exports = activitiesRouter;
