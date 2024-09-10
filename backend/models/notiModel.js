const mongoose = require('mongoose');

const notiSchema = mongoose.Schema({
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          enum: ['inattività', 'altro'],
          required: true,
        },
        read: {
          type: Boolean,
          default: false,
        },
      }, {
        timestamps: true
});

module.exports = mongoose.model('Notifiche', notiSchema);