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

    // Trova tutti i workout per l'utente e ordina per data
    const workouts = await Workout.find({ user: req.user._id }).sort({ date: -1 });


    if (workouts.length === 0) {
      return res.status(404).json({ message: 'Nessun workout trovato' });
    }

    // Prendi il primo workout che è quello più recente (ordinato dal più recente)
    const lastWorkout = workouts[0];

    res.status(200).json({
      date: lastWorkout.date,
      startCoords: lastWorkout.startCoords,
      endCoords: lastWorkout.endCoords,
      time: lastWorkout.time,
      distance: lastWorkout.distance,
      type: lastWorkout.type
    });
  } catch (error) {
    res.status(400).json({ message: 'Errore nel recupero dell\'ultimo workout' });
  }
});

// @desc Elimina l'allenamento che l'utente ha selezionato nella pagina Workout
// @route GET /workout/delete-workout
// @access Private
const deleteWorkout = asyncHandler(async(req, res) => {

  try{
    const { id } = req.params;

    const result = await Workout.findByIdAndDelete(id);

    if(!result){
      return res.status(404).json({ message: 'Workout non trovato' });
    }

    res.status(200).json({ message: 'Workout eliminato con successo' });

  }catch(error){
    res.status(500).json({ message: 'Errore del server'});
  }

});

//API per ottenere le informazioni nelle card (PAGINA: statistiche)

// @desc Tempo di allenamento nel giorno corrente
// @route GET /workout/time-oggi
// @access Private
const timeDayWorkout = asyncHandler(async(req, res) => {

  try{
    const today = new Date();
    const startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
    const workoutsToday = await Workout.find({
      user: req.user._id,
      date: {
        $gte: startDay,
        $lt: endDay
      }
    });
  
    const tempoTot = workoutsToday.reduce((acc, workout) => acc + workout.time, 0);
  
    res.status(200).json({ tempoTot });

  }catch (error) {
    res.status(400).json({ message: 'Errore'});
  }

});

// @desc Distanza Percorsa nel giorno corrente
// @route GET /workout/distance-oggi
// @access Private
const distanceDayWorkout = asyncHandler(async(req, res) => {

  try{
    const today = new Date();
    const startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
    const workoutsToday = await Workout.find({
      user: req.user._id,
      date: {
        $gte: startDay,
        $lt: endDay
      }
    });
  
    const distTot = workoutsToday.reduce((acc, workout) => acc + workout.distance, 0);
  
    res.status(200).json({ distTot });

  }catch (error) {
    res.status(400).json({ message: 'Errore'});
  }
});

// @desc Allenamenti svoli nel giorno corrente
// @route GET /workout/num-oggi
// @access Private
const numDayWorkout = asyncHandler(async(req, res) => {
  try{
    const today = new Date();
    const startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
    const workoutsToday = await Workout.countDocuments({
      user: req.user._id,
      date: {
        $gte: startDay,
        $lt: endDay
      }
    });
  
  
    res.status(200).json({ workoutsToday });

  }catch (error) {
    res.status(400).json({ message: 'Errore'});
  }
});

// @desc Velocità media allenamento nel giorno corrente
// @route GET /workout/avg-oggi
// @access Private
const avgDayWorkout = asyncHandler(async(req, res) => {

  try{
    const today = new Date();
    const startDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
    const workoutsToday = await Workout.find({
      user: req.user._id,
      date: {
        $gte: startDay,
        $lt: endDay
      }
    });
  
    const distTot = workoutsToday.reduce((acc, workout) => acc + workout.distance, 0);

    const workoutsTime = await Workout.find({
      user: req.user._id,
      date: {
        $gte: startDay,
        $lt: endDay
      }
    });
  
    const tempoTot = workoutsTime.reduce((acc, workout) => acc + workout.time, 0);
    //tempo in ore
    const tempoH = tempoTot / 3600;
  
    const avg = distTot / tempoH;
  
    res.status(200).json({ avg });

  }catch (error) {
    res.status(400).json({ message: 'Errore'});
  }

});


//API per i grafici

// @desc Grafico dei tipi di workouts
// @route GET /workout/grafico-allenamenti
// @access Private
const graficoAllenamenti = asyncHandler(async (req, res) => {
    try {
      const workouts = await Workout.find({
        user: req.user._id,
      });

      // Inizializza un oggetto per contare i diversi tipi di allenamento
      const workoutTypesCount = {
        corsaSemplice: 0,
        fartlek: 0,
        lungo: 0,
        progressivo: 0,
        tempoRun: 0,
        ripetute: 0
      };

      // Conta il numero di allenamenti per ciascun tipo
      workouts.forEach((workout) => {
        switch (workout.type) {
          case 'Corsa Semplice':
            workoutTypesCount.corsaSemplice += 1;
            break;
          case 'Fartlek':
            workoutTypesCount.fartlek += 1;
            break;
          case 'Lungo':
            workoutTypesCount.lungo += 1;
            break;
          case 'Progressivo':
            workoutTypesCount.progressivo += 1;
            break;
          case 'Tempo Run':
            workoutTypesCount.tempoRun += 1;
            break;
          case 'Ripetute':
            workoutTypesCount.ripetute += 1;
            break;
          default:
            break;
        }
      });

      // Invia la risposta con il conteggio per ciascun tipo di allenamento
      res.status(200).json(workoutTypesCount);

    } catch (error) {
      res.status(400).json({ message: 'Errore nel calcolo del grafico' });
    }

});

// @desc Grafico dei tipi di workouts
// @route GET /workout/grafico-allenamenti
// @access Private
const graficoDistanza = asyncHandler(async (req, res) => {
  try {
    // Trova tutti gli allenamenti dell'utente
    const workouts = await Workout.find({
      user: req.user._id
    });

    // Se non ci sono allenamenti, restituisci un array vuoto
    if (workouts.length === 0) {
      return res.status(200).json([]);
    }

    // Funzione per ottenere un array di mesi tra due date
    const getMonthsInRange = (startDate, endDate) => {
      const months = [];
      const date = new Date(startDate);

      // Loop per generare tutti i mesi tra startDate e endDate
      while (date <= endDate) {
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        months.push(monthYear);
        date.setMonth(date.getMonth() + 1);
      }

      return months;
    };

    // Trova la data più vecchia e la più recente degli allenamenti
    const firstWorkout = new Date(Math.min(...workouts.map(w => new Date(w.date).getTime())));
    const lastWorkout = new Date();

    // Genera l'elenco di mesi dall'inizio degli allenamenti fino ad oggi
    const allMonths = getMonthsInRange(firstWorkout, lastWorkout);

    // Oggetto per raggruppare la distanza totale per mese
    const monthlyDistance = {};

    // Inizializza ogni mese con 0 distanza
    allMonths.forEach(month => {
      monthlyDistance[month] = 0;
    });

    // Somma la distanza percorsa per ciascun mese
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      const monthYear = `${workoutDate.getFullYear()}-${(workoutDate.getMonth() + 1).toString().padStart(2, '0')}`;

      // Verifica che il mese esista
      if (monthlyDistance[monthYear] !== undefined) {
        // Aggiungi la distanza dell'allenamento
        if (typeof workout.distance === 'number' && workout.distance >= 0) {
          monthlyDistance[monthYear] += workout.distance;
        } else {
          console.warn(`Invalid distance for workout: ${workout.distance}`);
        }
      }
    });

    // Trasforma l'oggetto in un array ordinato per mese
    const monthlyData = Object.keys(monthlyDistance).sort().map(month => ({
      month,
      totalDistance: monthlyDistance[month] || 0  // Imposta a 0 se null o undefined
    }));

    console.log('Monthly Distance Data:', monthlyData); // Debugging output

    // Rispondi con i dati
    res.status(200).json(monthlyData);

  } catch (error) {
    console.error('Errore:', error); // Debugging output
    res.status(400).json({ message: 'Errore nel calcolo della distanza percorsa per mese', error });
  }
});
  

// @desc Grafico dei tipi di workouts
// @route GET /workout/grafico-allenamenti
// @access Private
const graficoVelocita = asyncHandler(async (req, res) => {
  try {
    // Trova tutti gli allenamenti dell'utente
    const workouts = await Workout.find({
      user: req.user._id
    });

    // Se non ci sono allenamenti, restituisci un array vuoto
    if (workouts.length === 0) {
      return res.status(200).json([]);
    }

    // Oggetto per raggruppare le velocità per tipo di allenamento
    const speedData = {};

    // Calcola la velocità e aggrega i dati
    workouts.forEach(workout => {
      if (typeof workout.distance === 'number' && typeof workout.time === 'number' && workout.time > 0) {
        const speed = workout.distance / workout.time;

        // Verifica se il tipo di allenamento esiste già
        if (!speedData[workout.type]) {
          speedData[workout.type] = {
            totalSpeed: 0,
            count: 0
          };
        }

        // Aggiungi la velocità al tipo di allenamento
        speedData[workout.type].totalSpeed += speed;
        speedData[workout.type].count += 1;
      } else {
        console.warn(`Invalid data for workout: ${workout}`);
      }
    });

    // Trasforma l'oggetto in un array con la velocità media per ciascun tipo
    const averageSpeedData = Object.keys(speedData).map(type => ({
      type,
      averageSpeed: (speedData[type].totalSpeed / speedData[type].count).toFixed(2) // Media delle velocità
    }));

    console.log('Average Speed Data:', averageSpeedData); // Debugging output

    // Rispondi con i dati
    res.status(200).json(averageSpeedData);

  } catch (error) {
    console.error('Errore:', error); // Debugging output
    res.status(400).json({ message: 'Errore nel calcolo della velocità media per tipo di allenamento', error });
  }
});

// @desc Grafico del tempo di workout mese x mese workoudei tipi dts
// @route GET /workout/grafico-tempo
// @access Private
const graficoTempo = asyncHandler(async (req, res) => {
  try {
    // Trova tutti gli allenamenti dell'utente
    const workouts = await Workout.find({
      user: req.user._id
    });

    // Se non ci sono allenamenti, restituisci un array vuoto
    if (workouts.length === 0) {
      return res.status(200).json([]);
    }

    // Funzione per ottenere un array di mesi tra due date
    const getMonthsInRange = (startDate, endDate) => {
      const months = [];
      const date = new Date(startDate);

      // Loop per generare tutti i mesi tra startDate e endDate
      while (date <= endDate) {
        const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        months.push(monthYear);
        date.setMonth(date.getMonth() + 1);
      }

      return months;
    };

    // Trova la data più vecchia e la più recente degli allenamenti
    const firstWorkout = new Date(Math.min(...workouts.map(w => new Date(w.date).getTime())));
    const lastWorkout = new Date();

    // Genera l'elenco di mesi dall'inizio degli allenamenti fino ad oggi
    const allMonths = getMonthsInRange(firstWorkout, lastWorkout);

    // Oggetto per raggruppare il tempo totale di allenamento per mese
    const monthlyWorkoutTime = {};

    // Inizializza ogni mese con 0 tempo di allenamento
    allMonths.forEach(month => {
      monthlyWorkoutTime[month] = 0;
    });

    // Somma il tempo di allenamento per ciascun mese
    workouts.forEach(workout => {
      const workoutDate = new Date(workout.date);
      const monthYear = `${workoutDate.getFullYear()}-${(workoutDate.getMonth() + 1).toString().padStart(2, '0')}`;

      // Verifica che il mese esista
      if (monthlyWorkoutTime[monthYear] !== undefined) {
        // Aggiungi il tempo dell'allenamento
        if (typeof workout.time === 'number' && !isNaN(workout.time)) {
          monthlyWorkoutTime[monthYear] += workout.time;
        } else {
          console.warn(`Invalid time for workout: ${workout.time}`);
        }
      }
    });

    // Trasforma l'oggetto in un array ordinato per mese
    const monthlyData = Object.keys(monthlyWorkoutTime).sort().map(month => ({
      month,
      totalTime: monthlyWorkoutTime[month] || 0  // Imposta a 0 se null o undefined
    }));

    console.log('Monthly Data:', monthlyData); // Debugging output

    // Rispondi con i dati mese per mese
    res.status(200).json(monthlyData);

  } catch (error) {
    console.error('Errore:', error); // Debugging output
    res.status(400).json({ message: 'Errore nel calcolo del tempo di allenamento per mese', error });
  }
});

//Funzione per calcolare il punteggio
function Punteggio (workouts){

  let punteggio = 0;
  let distTot = 0;
  let tempoTot = 0;

  workouts.forEach(workout => {
    distTot += workout.distance;
    tempoTot += workout.time;
  });

  const punteggioDist = Math.min(50, distTot * 2);
  const punteggioTempo = Math.min(50, tempoTot * 0.5);

  punteggio = punteggioDist + punteggioTempo;

  return Math.floor(Math.min(100, punteggio));
}

// @desc Calcolo punteggio per monitorare la qualità degli allenamenti dell'utente mensilmente
// @route GET /workout/punteggio
// @access Private
const calcolaPunteggio = asyncHandler(async (req, res) => {
  try{
    //const userId = req.params.id;
    const mese = new Date().getMonth();
    const anno = new Date().getFullYear();

    const inzio = new Date(anno, mese, 1);
    const fine = new Date(anno, mese + 1, 0, 23, 59, 59);

    const workouts = await Workout.find({
      user: req.user._id,
      date: { 
        $gte: inzio, 
        $lte: fine 
      }
    });

    const punteggio = Punteggio(workouts);

    let desc = '';

    if(punteggio >= 80){
      desc = 'Stai andando forte, continua così!';
    }else if(punteggio >= 60){
      desc = 'Ottimo, stai migliorando, non fermarti...';
    }else if(punteggio >=30){
      desc = 'Potresti migliorare, continua ad allenarti!';
    }else{
      desc = 'È arrivata l\'ora di allenarsi...';
    }

    res.status(200).json({ punteggio, desc, message: "Calcolo punteggio avvenuto con successo!" });

  }catch(error){
    res.status(400).json({message: "Errore nel calcolo del punteggio.", error: error.message});
  }
});

module.exports = {
    createWorkout,
    showWorkout,
    lastWorkout,
    deleteWorkout,
    timeDayWorkout,
    distanceDayWorkout,
    numDayWorkout,
    avgDayWorkout,
    graficoAllenamenti,
    graficoTempo,
    graficoVelocita,
    graficoDistanza,
    calcolaPunteggio
};
