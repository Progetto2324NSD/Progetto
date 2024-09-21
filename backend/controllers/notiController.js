const asyncHandler = require('express-async-handler');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Workout = require('../models/workoutModel');
const Notification = require('../models/notiModel');
const User = require('../models/userModel');

// Configurazione del trasportatore per l'invio di email
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

// Funzione per inviare email
const inviaEmail = asyncHandler(async (to, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM, // Assicurati di avere un'email mittente configurata
      to,
      subject,
      html: `
        <html>
          <body style="font-family: Arial, sans-serif; color: #333; background-color: #f9f9f9; margin: 0; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
              <h2 style="color: #007bff;">Ti manca un po' di movimento!</h2>
              <p style="font-size: 16px;">Ciao,</p>
              <p style="font-size: 16px;">Abbiamo notato che non hai effettuato allenamenti negli ultimi 7 giorni. Non dimenticare di dedicare un po' di tempo per mantenerti attivo e in forma!</p>
              <p style="font-size: 16px;">Grazie per far parte della nostra community e per il tuo impegno verso uno stile di vita sano.</p>
              <p style="font-size: 16px;">A presto,</p>
              <p style="font-size: 16px;">Il Team di FitLog Tracker</p>
            </div>
          </body>
        </html>
      `,
    });
    console.log(`Email inviata a ${to}`);
  } catch (error) {
    console.error('Errore nell\'invio dell\'email', error);
  }
});

// Pianificazione del cron job per controllare l'inattività ogni giorno alle 14:19
cron.schedule('30 13 * * *', asyncHandler(async () => {
  try {
    const users = await User.find();

    // Ciclo su tutti gli utenti
    for (let user of users) {
      // Recupera l'ultimo allenamento dell'utente
      const lastWorkout = await Workout.findOne({ user: user._id }).sort({ date: -1 });

      // Verifica se l'utente non si allena da più di 5 minuti
      if (!lastWorkout || (new Date() - new Date(lastWorkout.date)) > 7 * 24 * 60 * 60 * 1000) {
        // Crea e salva una nuova notifica
        const notification = new Notification({
          user: user._id,
          message: 'Non ti alleni da 7 giorni! Riprendi il tuo allenamento per mantenerti in forma.',
          type: 'inattività',
        });
        await notification.save();

        // Invia un'email di notifica all'utente
        await inviaEmail(user.email, 'Promemoria allenamento', notification.message);
      }
    }
  } catch (error) {
    console.error('Errore nella pianificazione delle notifiche', error);
  }
}));

// @desc Restituisce la notifica
// @route GET /notifiche/notifiche
// @access Private
const getNoti = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id });
  res.json(notifications);
});

// @desc Cancella la notifica
// @route DELETE /notifiche/notifiche:id
// @access Private
const deleteNoti = asyncHandler(async (req, res) => {

  const notification = await Notification.findById(req.params.id);

  if (notification.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Non autorizzato');
  }

  await notification.deleteOne();
  res.json({ message: 'Notifica eliminata' });
});

module.exports = {
  getNoti,
  deleteNoti,
};
