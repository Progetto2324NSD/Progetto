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
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
 
// Reset Password
const nodemailer = require('nodemailer');
const crypto = require('crypto');
 
// Richiamo il Model User
const User = require('../models/userModel');
 
// @desc Salva utente
// @route POST /users
// @access Private
const createUser = asyncHandler (async (req, res) => {
 
    const { name, email, password } = req.body;
 
    // Verifico se l'utente è già presente nel DB
    const userExists = await User.findOne({ email });
 
    if (userExists) {
        res.status(400);
        throw new Error('Utente già presente');
    }
 
    // Password hashata
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
 
    // Creo l'utente
    const user = await User.create({
        name,
        email,
        password: hash,
    });
 
    // Verifico che l'utente sia stato creato correttamente
    if (user) {
        // Genera il token JWT
        const token = generateToken(user._id);
 
        // Imposta il cookie con il token JWT
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            path: '/'
        });
 
        // Invia la risposta con i dettagli dell'utente
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(400).json({ message: "Errore durante la creazione dell'utente" });
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
 
        const token = generateToken(user._id);
 
        // Imposta il cookie con il token
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            path: '/'
        });
 
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
    } else {
        res.status(401).json({ message: 'Email o password non validi' });
    }
});

// @desc Verifica la risposta del middleware protect
// @route GET /user/auth
// @access Private
const verificaAuth = asyncHandler(async (req, res) => {
    // Non restituisco la password o altri dati sensibili
    const { _id, name, email } = req.user;
    res.status(200).json({ _id, name, email });
});
 
// @desc Dati Utente
// @route GET /user/data
// @access Public
const getData = asyncHandler (async (req, res) => {
    const { _id, name, email } = await User.findById(req.user.id);
 
    res.status(200).json({
        id: _id,
        name,
        email,
        message: "Info utente stampate",
    });
});
 
// Funzione richiamata nel mailOTP per generare un codice OTP casuale a 4 cifre
const generateOTP = (length = 4) => {
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};
 
// @desc Invia la mail all'utente con il codice OTP
// @route POST /user/reset-password
// @access Private
const mailOTP = asyncHandler(async (req, res) => {
    const { email } = req.body;
 
    try {
        const user = await User.findOne({ email });
 
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }
 
        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);
 
        user.resetOtp = hashedOtp;
        user.resetOtpExpires = Date.now() + 300000; // 5 min di validità
 
        await user.save();
 
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
            html: `
                <html>
                    <body>
                        <h2>Reset della Password</h2>
                        <p>Ciao,</p>
                        <p>Hai richiesto il reset della password.</p>
                        <p>Il tuo codice OTP è:</p>
                        <h3>${otp}</h3>
                        <p>Inserisci questo codice nella pagina di reset.</p>
                        <p>Grazie,</p>
                        <p>Il Team di Supporto</p>
                    </body>
                </html>
            `,
        };
 
        await transporter.sendMail(mailOptions);
 
        res.status(200).json({ message: 'Codice OTP inviato tramite email' });
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
        res.status(500).json({ message: 'Errore durante l\'invio dell\'email', error: error.message });
    }
});
 
// @desc Verifica il codice OTP inviato
// @route POST /user/verificaOTP
// @access Private
const verificaOTP = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        let otpFlag = true;
 
        const user = await User.findOne({ email });
 
        if (!user) {
            return res.status(400).json({ message: 'Utente non trovato' });
        }

        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) {
            return res.status(400).json({ message: 'OTP non valido' });
        }

        if (user.resetOtpExpires < Date.now()) {
            otpFlag = false;
            return res.status(400).json({ message: 'OTP scaduto' });
        }

        if (user && isMatch && otpFlag) {
            const token = generateToken(user._id);
 
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });

            return res.json({
                email: user.email,
            });
        } else {
            return res.status(401).json({ message: 'OTP non valido' });
        }
 
    } catch (error) {
        console.error('Errore durante la verifica dell\'OTP:', error);
        return res.status(500).json({ message: 'Errore interno del server' });
    }
});
 
// @desc Cambia password post verifica OTP
// @route POST /user/cambia-password
// @access Private
const cambiaPassword = asyncHandler(async (req, res) => {
    try{
        const { email, password } = req.body;
 
        const user = await User.findOne({ email });

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
 
        user.password = hash;
 
        await user.save();
 
        res.status(200).json({ message: 'Password cambiata con successo' });
 
    } catch (error) {
        res.status(500).json({ message: 'Errore' });
    }
});

// @desc Effettua il logout
// @route POST /user/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 0,
        path: '/'
    });
 
    res.status(200).json({ message: 'Logout effettuato con successo' });
});
 
// Genero il tokenJWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT, {
        expiresIn: '24h',
    });
};
 
module.exports = {
    createUser,
    loginUser,
    getData,
    mailOTP,
    verificaOTP,
    cambiaPassword,
    logout,
    verificaAuth
};
