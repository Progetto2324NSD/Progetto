/*
Le rotte definiscono gli endpoint dell'applicazione e instradano le richieste HTTP ai controller appropriati. Separano la logica di routing dalla logica applicativa, migliorando la modularità e la manutenzione del codice.

Funzioni principali:

Definizione degli endpoint: Specificano gli URL e i metodi HTTP (GET, POST, PUT, DELETE) per ciascun endpoint.
Instradamento delle richieste: Instradano le richieste agli handler appropriati nei controller.
Middleware: Possono utilizzare middleware per eseguire operazioni comuni (come l'autenticazione o la validazione) prima di arrivare ai controller.
*/

const express = require('express');
const router = express.Router();

//Richiamo il Controller
const { createUser, loginUser, getData, mailOTP, verificaOTP } = require("../controllers/userController");

//"Proteggo" la chiamata dell'API getData tramite Middleware
const { protect } = require("../middlewares/authMiddleware");

//Utilizzo delle API del Controller (UTENTE)
router.post('/', createUser);
router.post('/login', loginUser);
router.get('/data', protect, getData);

//Utilizzo API reset Password (UTENTE) Prima API verificata, da verificare la seconda
router.post('/reset-password', mailOTP);
router.post('/verificaOTP', verificaOTP);

//RICORDA QUANDO CHIAMO UN API PER I DATA DEVO PROTEGGERLE ES: router.route('/').get(protect, getGoals).post(setGoals)


/*
router.get('/', getGoals);
router.post('/', setGoal);
router.put('/:id', updateGoal);
router.delete('/:id', delateGoal);
*/

/*
ALTERNATIVA
router.route('/').get(getGoals).post(setGoal);
router.route('/:id').put(updateGoals).delate(delateGoal);
*/


module.exports = router;