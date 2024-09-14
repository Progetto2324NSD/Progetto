const mongoose = require('mongoose');

const workoutSchema = mongoose.Schema({
  distance: {
    type: Number,
    required: true,
    trim: true,
  },
  time: {
    type: Number,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    default: null,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,  // Referenza all'utente
    ref: 'User',
    required: true,
  },
  startCoords: {
    type: [Number], // Un array di due numeri [long, lat]
    required: true,
  },
  endCoords: {
    type: [Number], // Un array di due numeri [long, lat]
    required: true,
  },
},
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Workout', workoutSchema);
