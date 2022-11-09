const client = require("./client")
	const {attachActivitiesToRoutines} = require("./activities")

async function getRoutineById(id) {
	try {
		const {
			rows: [routine]
		} = await client.query(
			`
    SELECT * FROM routines
    WHERE id=$1    
    `,
			[id]
		)

		return routine
	} catch (error) {
		console.log(error)
		throw error
	}
}

async function getRoutinesWithoutActivities() {
	const { rows } = await client.query(`
    SELECT * FROM routines;
  `)

	return rows
}

async function getAllRoutines() {
	try {
		const {
			rows
		} = await client.query(`
    SELECT routines.goal, routines."creatorId", routines."isPublic", routines.id, username AS "creatorName", routines.name
    FROM routines
    JOIN users
    ON routines."creatorId"=users.id    
    `)

		return attachActivitiesToRoutines(rows)
	} catch (error) {
		console.log(error)
		throw error
	}
}

async function getAllRoutinesByUser({ username }) {
	try {
		const {
			rows: [routine]
		} = await client.query(
			`
      SELECT  FROM routines
      WHERE username=$1;
    `[username]
		)

		return routine
	} catch (error) {
		console.log(error)
		throw error
	}
}

async function getPublicRoutinesByUser({ username }) {
	try {
		const {
			rows: [routine]
		} = await client.query(`
    SELECT "routineId", routines.name as Routine_Name, activities.name AS Activity_Name, description, users.username AS creatorName, duration, count, "activityId"
    FROM routines
    JOIN routine_activities
    ON routines.id=routine_activities."routineId"
    JOIN activities
    ON routine_activities."activityId"=activities.id
    JOIN users
    ON routines."creatorId"=users.id

    `)

		if (username == routine.creatorId && routine.isPublic === true)
    return routine

	} catch (error) {
		console.log(error)
		throw error
	}
}

async function getAllPublicRoutines() {}

async function getPublicRoutinesByActivity({ id }) {}

async function createRoutine({ creatorId, isPublic, name, goal }) {
	try {
		const {
			rows: [routine]
		} = await client.query(
			`
    INSERT INTO routines ("creatorId", "isPublic", name, goal)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (name) DO NOTHING
    RETURNING *;
    `,
			[creatorId, isPublic, name, goal]
		)

		return routine
	} catch (error) {
		console.log(error)
		throw error
	}
}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
	getRoutineById,
	getRoutinesWithoutActivities,
	getAllRoutines,
	getAllPublicRoutines,
	getAllRoutinesByUser,
	getPublicRoutinesByUser,
	getPublicRoutinesByActivity,
	createRoutine,
	updateRoutine,
	destroyRoutine
}
