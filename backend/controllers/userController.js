/*
I controller contengono la logica di business dell'applicazione. Gestiscono le operazioni CRUD (Create, Read, Update, Delete) e qualsiasi altra logica applicativa, come l'autenticazione, la validazione dei dati, e l'interazione con il database.

Funzioni principali:

Gestione delle richieste: Ricevono le richieste dalle rotte e gestiscono la logica necessaria per rispondere a queste richieste.
Interazione con il database: Utilizzano i modelli per interagire con il database MongoDB.
Elaborazione dei dati: Possono manipolare, validare e processare i dati prima di inviarli come risposta.
Invio delle risposte: Rispondono con i dati necessari o con messaggi di errore appropriati.
*/

/*
Utilizzando express-async-handler, puoi evitare di dover utilizzare blocchi try-catch per catturare errori all'interno delle funzioni asincrone. 
Questo middleware cattura automaticamente le eccezioni e le passa alla gestione degli errori di Express, mantenendo il codice più pulito e leggibile.
*/
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//Reset Password
const nodemailer = require('nodemailer');
const crypto = require('crypto');

//richiamo il model User
const User = require('../models/userModel');

// @desc Salva utente
// @route POST /users
// @access Private
const createUser = asyncHandler (async (req, res) => {

    const { name, email, password } = req.body;

    //verifico se l'utente è gia presente nel DB
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400)
        throw new Error('Utente già presente');
    }

    //password hasata 
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    //Creo l'utente
    const user = await User.create({
        name,
        email,
        password: hash,
    });

    //Verifico che l'utente sia stato creato correttamente
    if(user) {
        res.status(201).json( {
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    }else{
        res.status(400).json({message: "Errore durante la creazione dell'utente"});
    }
    
});

// @desc Login utente
// @route POST /users
// @access Private
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Verifica se l'utente è presente nel DB
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: 'Utente non presente nel database' });
    }

    // Confronto della password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (user && isPasswordValid) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Email o password non validi' });
    }
});

// @desc Dati Utente
// @route GET /user/data
// @access Public
const getData = asyncHandler (async (req, res,) => {

    const {_id, name, email } = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        name,
        email,
        message: "Info utente stampati"
    });

    res.json({ message: "Info utente stampati"});
});

// @desc Reset password
// @route POST /user/reset-password
// @access Public
const generateOTP = (length = 4) => {
    let otp = '';
    //Genera un numero da 0 a 9
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

//Aggiungere DESCRIZIONE E CAMBIARE NOME ALL'API POICHè MOLTO CONTROVERSA CON L'API PER AGGIORNARE LA PASSWORD
const mailOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
        // Verifica se l'utente è presente nel DB
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        // Genera l'OTP numerico e lo hasha
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.resetOtp = hashedOtp;
        user.resetOtpExpires = Date.now() + 300000; // 5 min di validità

        await user.save();

        // Configurazione di Nodemailer
        const transporter = nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Reset della Password',
            text: `Il tuo codice OTP per il reset della password è ${otp}.`,
        };

        // Invia l'email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Codice OTP inviato tramite email' });
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
        res.status(500).json({ message: 'Errore durante l\'invio dell\'email', error: error.message });
    }
});

//Aggiungere DESCRIZIONE E VEDERE COME PROTEGGERE IL CAMBIO PASSWORD
const verificaOTP = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        const flagOtp = true;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Utente non trovato' });
        }

        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) {
            return res.status(400).json({ message: 'OTP non valido' });
        }

        if (user.resetOtpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP scaduto' });
            flagOtp = false;
        }

        /*if(user && isMatch && flagOtp){
            token: generateToken(user._id);
        }*/

        res.status(200).json({ message: 'OTP verificato' });
    } catch (error) {
        console.error('Errore durante la verifica dell\'OTP:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
});

// @desc Cambia password post verifica OTP
// @route POST /user/cambia-password
// @access Provate
const cambiaPassword = asyncHandler(async (req, res) => {
    try{
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        //password hasata 
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Assegna l'hash della nuova password al campo password dell'utente
        user.password = hash;

        // Salva l'utente aggiornato nel database
        await user.save();

        res.status(200).json({ message: 'Password cambiata con successo' });

    }catch(error){
        res.status(200).json({ message: 'Errore' });
    }
});


//Genero il tokenJWT per il login
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT, {
        expiresIn: '1h'
    })
}

module.exports = {
    createUser,
    loginUser,
    getData,
    mailOTP,
    verificaOTP,
    cambiaPassword,
}