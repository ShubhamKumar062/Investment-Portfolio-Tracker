require('dotenv').config()
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const routes = require('./routes/authRoutes.js');
const connectDB = require('./config/db.js');

const app = express();
const PORT = process.env.PORT || 3777

app.use(express.json());
app.use(cors())
app.use('/api/auth', routes)


connectDB.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server is listening on ${PORT}`)
    })
})
.catch((err)=>{
    console.log("Server Error", err)
})
