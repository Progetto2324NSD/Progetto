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
    origin: 'http://localhost:3000',
    credentials: true
}));

// Parser dei cookies
app.use(cookieParser());

// Per usare il body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Includi le route
app.use('/user', require('./routes/userRoutes'));
app.use('/workout', require('./routes/workoutRoutes'));

// Middleware di gestione degli errori
app.use(errorHandler);

app.listen(port, () => console.log(`Il server è in ascolto sulla porta ${port}`));
