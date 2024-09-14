const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Controllo se il token è presente nei cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Se il token non è nei cookie, controllo anche l'header Authorization
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }


  // Verifico il token
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT);

      // Recupero l'utente tramite il token decodificato
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Errore durante la verifica del token:', error);
      res.status(401);
      throw new Error('Non autorizzato');
    }
  } else {
    res.status(401);
    throw new Error('Non autorizzato, nessun token');
  }
});

module.exports = { protect };
