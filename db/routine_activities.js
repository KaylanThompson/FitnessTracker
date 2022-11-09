const client = require('./client')

async function getRoutineActivityById(id){
  try {
    const { rows: [routineActivity] } = await client.query(`
    SELECT *
    FROM routines_activities
    WHERE id=$1;
  `, [id]);
    return routineActivity;
    
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try {
    const { rows: [routine] } = await client.query(`
    INSERT INTO routine_activities ("routineId", "activityId", duration, count)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT ("routineId", "activityId") DO NOTHING
    RETURNING *;
    `, [routineId, activityId, count, duration]);
    
    return routine;
  } catch (error) {
    console.log(error)
    throw error    
  }

    
}

async function getRoutineActivitiesByRoutine({id}) {
  try {
    const { rows } = await client.query(`
    SELECT * FROM routines_activities;
    `)
    return rows
    
  } catch (error) {
     console.log(error)
    throw error
  }

}

async function updateRoutineActivity ({id, ...fields}) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  try {
    if (setString.length > 0) {
      await client.query(`
        UPDATE routines_activities
        SET ${ setString }
        WHERE id=${ id }
        RETURNING *;
      `, Object.values(fields));
    }
    return await getRoutineActivityById(id)
    
  } catch (error) {
    console.log(error)
    throw error;
  }
}

async function destroyRoutineActivity(id) {
  
}

async function canEditRoutineActivity(routineActivityId, userId) {
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
