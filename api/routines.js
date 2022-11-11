const express = require('express');
const routinesRouter = express.Router();
const {getAllPublicRoutines} = require('../db')

// GET /api/routines
routinesRouter.get("/", async (req, res, next) => {

    const routines = await getAllPublicRoutines();

    res.send(routines);

})

// POST /api/routines

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = routinesRouter;
