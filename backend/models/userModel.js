//Crea una struttura per memorizzare e gestire i dati degli utenti in un database MongoDB
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    resetOtp: {
        type: String,
        default: null,
    },
    resetOtpExpires: {
        type: Date,
        default: null,
    }
    
},
    {
        timestamps: true,
    }
)

module.exports = mongoose.model('User', userSchema);