const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { errorHandler } = require('./middlewares/errorMiddleware.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db.js');

const port = process.env.PORT || 5000;

// Connessione al database
connectDB(); 

// Inizializzo l'app express
const app = express();

// Cors per permettere le richieste da altri domini
app.use(cors({
    origin: 'https://progetto-frontend.onrender.com',
    credentials: true,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Parser dei cookies
app.use(cookieParser());

// Per usare il body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Includi le route
app.use('/user', require('./routes/userRoutes'));
app.use('/workout', require('./routes/workoutRoutes'));
app.use('/notifiche', require('./routes/notiRoutes'));

// Middleware di gestione degli errori
app.use(errorHandler);

console.log('Ciao a tutti belli e brutti');
app.listen(port, () => console.log(`Il server è in ascolto sulla porta ${port}`));
