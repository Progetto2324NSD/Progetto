const express = require('express');
const router = express.Router();
const { createWorkout, showWorkout, lastWorkout } = require('../controllers/workoutController');

const { protect } = require('../middlewares/authMiddleware');

router.post('/', protect, createWorkout);
router.get('/show-workout', protect, showWorkout);
router.get('/last-workout', protect, lastWorkout);

module.exports = router;
