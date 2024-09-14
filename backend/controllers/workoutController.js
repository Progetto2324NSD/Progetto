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

// @desc Grafico dei tempi di ciascun tipo di workouts
// @route GET /workout/distanza-allenamenti
// @access Private
const graficoDistanza = asyncHandler(async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    
    // Aggregazione dei dati per mese
    const data = await Workout.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(`${currentYear}-01-01`), // Inizio dell'anno corrente
            $lt: new Date(`${currentYear + 1}-01-01`) // Inizio dell'anno successivo
          }
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: "$date" }, 
            month: { $month: "$date" }
          },
          distanzaTotale: { $sum: "$distance" }
        }
      },
      {
        $sort: { "_id.month": 1 } // Ordinamento per mese
      },
      {
        $project: {
          _id: 0,
          mese: "$_id.month",
          distanza: { $ifNull: ["$distanzaTotale", 0] } // Imposta la distanza a 0 se non ci sono dati
        }
      }
    ]);

    // Creazione di un array con tutti i mesi e le distanze, senza etichetta del mese
    const result = Array.from({ length: 12 }, (_, i) => {
      const meseData = data.find(d => d.mese === (i + 1)) || { mese: i + 1, distanza: 0 };
      return meseData.distanza;
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
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

    // Definisci l'ordine desiderato dei tipi di allenamento
    const order = [
      'Lungo',
      'Tempo Run',
      'Fartlek',
      'Ripetute',
      'Corsa Semplice',
      'Progressivo'
    ];

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

    // Trasforma l'oggetto in un array con solo le velocità medie
    const averageSpeeds = order.map(type => (
      speedData[type] ? (speedData[type].totalSpeed / speedData[type].count).toFixed(2) : '0.00'
    ));

    console.log('Average Speeds:', averageSpeeds); // Debugging output

    // Rispondi con le medie delle velocità
    res.status(200).json(averageSpeeds);

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
    // Ottieni l'anno corrente
    const currentYear = new Date().getFullYear();

    // Aggrega i dati per tipo di allenamento e somma i tempi
    const data = await Workout.aggregate([
      { $match: { date: { $gte: new Date(currentYear, 0, 1), $lt: new Date(currentYear + 1, 0, 1) } } }, // Filtra per anno corrente
      {
        $group: {
          _id: '$type', // Raggruppa per tipo di allenamento
          totalTime: { $sum: '$time' } // Somma i tempi
        }
      }
    ]);

    // Prepara i dati per il grafico a torta
    const formattedData = {
      corsaSemplice: 0,
      fartlek: 0,
      lungo: 0,
      progressivo: 0,
      tempoRun: 0,
      ripetute: 0
    };

    // Mappa i dati aggregati ai tipi di allenamento
    data.forEach(item => {
      switch (item._id) {
        case 'Corsa Semplice':
          formattedData.corsaSemplice = item.totalTime;
          break;
        case 'Fartlek':
          formattedData.fartlek = item.totalTime;
          break;
        case 'Lungo':
          formattedData.lungo = item.totalTime;
          break;
        case 'Progressivo':
          formattedData.progressivo = item.totalTime;
          break;
        case 'Tempo Run':
          formattedData.tempoRun = item.totalTime;
          break;
        case 'Ripetute':
          formattedData.ripetute = item.totalTime;
          break;
        default:
          break;
      }
    });

    // Invia la risposta con il conteggio per ciascun tipo di allenamento
    res.status(200).json(formattedData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore nel recupero dei dati' });
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
