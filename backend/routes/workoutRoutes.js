const express = require('express');
const router = express.Router();
const { createWorkout, showWorkout, lastWorkout, deleteWorkout, timeDayWorkout, distanceDayWorkout, numDayWorkout, avgDayWorkout, graficoAllenamenti, graficoTempo, graficoVelocita, graficoDistanza, calcolaPunteggio } = require('../controllers/workoutController');

const { protect } = require('../middlewares/authMiddleware');

//Route pagine
router.post('/', protect, createWorkout);
router.get('/show-workout', protect, showWorkout);
router.get('/last-workout', protect, lastWorkout);
router.delete('/delete-workout/:id', protect, deleteWorkout);

//Route Qualità allenamenti (Card Dashboard)
router.get('/allenamento', protect, calcolaPunteggio);

//Route Card
router.get('/time-oggi', protect, timeDayWorkout);
router.get('/distance-oggi', protect, distanceDayWorkout);
router.get('/num-oggi', protect, numDayWorkout);
router.get('/avg-oggi', protect, avgDayWorkout);

//Route Grafici
router.get('/tipo-allenamenti', protect, graficoAllenamenti);
router.get('/tempo-allenamenti', protect, graficoTempo);
router.get('/velocita-allenamenti', protect, graficoVelocita);
router.get('/distanza-allenamenti', protect, graficoDistanza);


module.exports = router;
