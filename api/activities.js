const express = require('express');
const { getAllActivities, } = require('../db');
const activitiesRouter = express.Router();

// GET /api/activities/:activityId/routines

// GET /api/activities
activitiesRouter.get('/', async (req, res ) =>{
    const activities = await getAllActivities();
    res.send(activities);
});

// POST /api/activities




// PATCH /api/activities/:activityId

module.exports = activitiesRouter;
