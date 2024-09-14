const express = require('express');
const router = express.Router();

// Importa i controller
const { getNoti, deleteNoti } = require('../controllers/notiController');
const { protect } = require("../middlewares/authMiddleware");

// Route per le notifiche
router.get('/notifiche', protect, getNoti);
router.delete('/notifiche/:id', protect, deleteNoti);

module.exports = router;
