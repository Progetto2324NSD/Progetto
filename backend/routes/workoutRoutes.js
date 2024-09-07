const express = require('express');
const router = express.Router();
const { createWorkout, showWorkout, lastWorkout, timeDayWorkout, distanceDayWorkout, numDayWorkout, avgDayWorkout } = require('../controllers/workoutController');

const { protect } = require('../middlewares/authMiddleware');

//Route pagine
router.post('/', protect, createWorkout);
router.get('/show-workout', protect, showWorkout);
router.get('/last-workout', protect, lastWorkout);

//Route Card
router.get('/time-oggi', protect, timeDayWorkout);
router.get('/distance-oggi', protect, distanceDayWorkout);
router.get('/num-oggi', protect, numDayWorkout);
router.get('/avg-oggi', protect, avgDayWorkout);


module.exports = router;
