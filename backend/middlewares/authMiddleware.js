const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const protect = asyncHandler(async (req, res, next) => {

  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Prelevo il token dall'header
      token = req.headers.authorization.split(' ')[1]

      // Vrifico il token
      const decoded = jwt.verify(token, process.env.JWT)

      // Recupero l'utente tramite il token
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.log(error)
      res.status(401)
      throw new Error('Non autorizzato')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Non autorizzato, Nessun token presente')
  }
})

module.exports = { protect }
