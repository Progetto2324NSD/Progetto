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

//Richiamo il Model User
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
    if (user) {
        // Genera il token JWT
        const token = generateToken(user._id);

        // Imposta il cookie con il token JWT
        res.cookie('token', token, {
            httpOnly: true, // Impedisce l'accesso al cookie dal lato client (JavaScript)
            secure: process.env.NODE_ENV === 'production', // Imposta il cookie come sicuro in produzione
            sameSite: 'Strict', // Evita l'invio del cookie nelle richieste cross-site
            //maxAge: 3600000 // 1 ora in ms (LASCIARE COMMENTATO PERCHè FUNZIONERà DA SESSION STORAGE)
        });

        // Invia la risposta con i dettagli dell'utente
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
        });
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

        const token = generateToken(user._id);

        // Imposta il cookie con il token
        //CREARE UN COMMENTO UNICO PER IL COOKIE
        res.cookie('token', token, {
            httpOnly: true,    // Impedisce l'accesso al cookie tramite JavaScript lato client
            secure: process.env.NODE_ENV === 'production', // Imposta secure a true in produzione (richiede HTTPS)
            sameSite: 'strict',
            //maxAge: 3600000    // 1 ora in ms (LASCIARE COMMENTATO PERCHè FUNZIONERà DA SESSION STORAGE)
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            //token: token,
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

// @desc Genera OTP
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


//Gestisce una richiesta HTTP per inviare un codice OTP a un utente tramite mail per il reset della password
const mailOTP = asyncHandler(async (req, res) => {
    //Estrae l'email dal corpo della richiesta
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

        //Crea un'email con soggetto 'Reset della Password'
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: user.email,
            subject: 'Reset della Password',
            html: `
                <html>
                    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; margin: 0; padding: 20px;">
                        <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #007bff;">Reset della Password</h2>
                            <p style="font-size: 16px;">Ciao,</p>
                            <p style="font-size: 16px;">Hai richiesto il reset della password per il tuo account.</p>
                            <p style="font-size: 16px;">Il tuo codice OTP per il reset della password è:</p>
                            <h3 style="background-color: #007bff; color: #fff; padding: 10px; text-align: center; border-radius: 4px;">${otp}</h3>
                            <p style="font-size: 16px;">Per favore, inserisci questo codice nella pagina di reset della password.</p>
                            <p style="font-size: 16px;">Se non hai richiesto questo reset, puoi ignorare questa email.</p>
                            <p style="font-size: 16px;">Grazie,</p>
                            <p style="font-size: 16px;">Il Team di Supporto</p>
                        </div>
                    </body>
                </html>
            `,
        };
        
        // Invia l'email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Codice OTP inviato tramite email' });
        //Se si verifica un errore durante il processo,cattura l'eccezione, la registra nel log 
        //e restituisce una risposta con stato '500'
    } catch (error) {
        console.error('Errore durante l\'invio dell\'email:', error);
        res.status(500).json({ message: 'Errore durante l\'invio dell\'email', error: error.message });
    }
});

//VEDERE COME PROTEGGERE IL CAMBIO PASSWORD

//Gestisce una richiesta HTTP per verificare un codice OTP inviato precedentemente all'utente
const verificaOTP = asyncHandler(async (req, res) => {
    try {
        const { email, otp } = req.body;
        let otpFlag = true;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'Utente non trovato' });
        }
        //Confronta l'OTP fornito con quello memorizzato nel database
        const isMatch = await bcrypt.compare(otp, user.resetOtp);
        if (!isMatch) {
            return res.status(400).json({ message: 'OTP non valido' });
        }
        //Controlla se l'OTP è scaduto confrontando il timestamp di scadenza con l'ora corrente
        if (user.resetOtpExpires < Date.now()) {
            otpFlag = false;
            return res.status(400).json({ message: 'OTP scaduto' });
        }

        if (user && isMatch && otpFlag) {
            //Genera un token JWT per autenticare l'utente
            const token = generateToken(user._id);

            // Imposta il cookie con il token JWT
            res.cookie('token', token, {
                httpOnly: true, // Impedisce l'accesso al cookie dal lato client (JavaScript)
                secure: process.env.NODE_ENV === 'production', // Imposta il cookie come sicuro in produzione
                sameSite: 'Strict', // Evita l'invio del cookie nelle richieste cross-site
                //maxAge: 3600000 // 1 ora in ms (LASCIARE COMMENTATO PERCHè FUNZIONERà DA SESSION STORAGE)
            });

            // Assicurati che il token sia incluso nella risposta JSON
            return res.json({
                email: user.email,
            });
            
        } else {
            return res.status(401).json({ message: 'Email o password non validi' });
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

        //Password hashata 
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


//Genero il tokenJWT per il login/registrazione e password dimenticata
//Utilizza la libreria 'jwt' per firmare il token con una chiave segreta presa dalle variabili d'ambiente
//Token che può essere usato per autenticare l'utente nelle richieste future
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