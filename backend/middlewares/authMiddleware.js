const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Controllo se il token è presente nei cookie
  console.log('Cookies:', req.cookies); // Log dei cookie
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Se il token non è nei cookie, controllo anche l'header Authorization
  console.log('Authorization Header:', req.headers.authorization); // Log dell'header Authorization
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Errore durante la verifica del token:', error);
      res.status(401);
      throw new Error('Non autorizzato');
    }
  } else {
    console.log('Nessun token trovato');
    res.status(401);
    throw new Error('Non autorizzato, nessun token');
  }
});
