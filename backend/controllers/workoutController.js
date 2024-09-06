const asyncHandler = require('express-async-handler');
const Workout = require('../models/workoutModel');

// @desc Crea un nuovo workout
// @route POST /workout
// @access Private
const createWorkout = asyncHandler(async (req, res) => {
  const { distance, time, type, date, startCoords, endCoords } = req.body;

  try {
    const workout = await Workout.create({
      distance,
      time,
      type,
      date,
      startCoords,  
      endCoords,    
      user: req.user._id,  
    });

    res.status(201).json({
      distance: workout.distance,
      time: workout.time,
      type: workout.type,
      date: workout.date,
      startCoords: workout.startCoords,  
      endCoords: workout.endCoords,      
      user: workout.user,
      message: 'Workout memorizzato con successo',
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(400).json({ message: 'Errore durante la memorizzazione del workout' });
  }
});
  
// @desc Mostra tutti i workout di un utente in base alla data
// @route GET /workout/show-workout
// @access Private
const showWorkout = asyncHandler(async (req, res) => {

    const { date } = req.query; // Usa req.query per ottenere la data dalla query string

    try {
        const startDate = new Date(date);
        const endDate = new Date(date);
        endDate.setDate(startDate.getDate() + 1);

        const workouts = await Workout.find({
            user: req.user._id,
            date: {
                $gte: startDate,
                $lt: endDate
            }
        });

        res.status(200).json(workouts); // Rispondi con i workout trovati
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: 'Errore del server' });
    }
});

// @desc Recupera l'ultimo workout dell'utente
// @route GET /workout/last-workout
// @access Private
const lastWorkout = asyncHandler(async (req, res) => {
  try {
    // Trova tutti i workout per l'utente e ordina per data (timestamp)
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });

    // Log per verificare cosa restituisce la query
    console.log('Workout trovati per l\'utente:', workouts);

    if (workouts.length === 0) {
      return res.status(404).json({ message: 'Nessun workout trovato' });
    }

    // Prendi il primo workout che è quello più recente (ordinato dal più recente)
    const lastWorkout = workouts[0];

    // Log dell'ultimo workout trovato
    console.log('Ultimo workout trovato:', lastWorkout);

    // Includi date, startCoords e endCoords nella risposta
    res.status(200).json({
      date: lastWorkout.date,
      startCoords: lastWorkout.startCoords,
      endCoords: lastWorkout.endCoords,
    });
  } catch (error) {
    console.error('Errore nel recupero dell\'ultimo workout:', error);
    res.status(400).json({ message: 'Errore nel recupero dell\'ultimo workout' });
  }
});



module.exports = {
    createWorkout,
    showWorkout,
    lastWorkout
};
