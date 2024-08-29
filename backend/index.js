//punto di accesso al backend
const express = require('express');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { errorHandler } = require('./middlewares/errorMiddleware.js');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//chiamo db.js per la connessione a MONGO DB (ricordare URL in .env)
const connectDB = require('./config/db.js');

const port = process.env.PORT || 5000;

//connessione al database
connectDB(); 

//Inizializzo l'app express
const app = express();

//Cors per permettere le richieste da altri domini (RICORDARSI IL "credentials: true") Altrimenti non invia un caBBo
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

//Parser dei cookies
app.use(cookieParser());

//Per usare il body
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

app.use('/user', require('./routes/userRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Il server è in ascolto sulla porta ${port}`));

console.log("Ciao a tutti belli e brutti");
