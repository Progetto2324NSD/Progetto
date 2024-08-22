const mongoose = require('mongoose');

//funzione per connettersi al DB
const connectDB = async() =>{
   try{
    const conn = await mongoose.connect(process.env.MONGO_DB_URL);

    console.log(`Connesso al DB: ${conn.connection.host}`.cyan.
    underline);
   }catch(error){
    console.log(error);
    process.exit(1);
   }
};

module.exports = connectDB;