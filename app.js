const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true ,

}));


app.use(express.json());
app.use(express.urlencoded({extended:true}));


const limiter = rateLimit({

    windowMs : 15 * 60 * 1000,
    max: 100,
    message: {success: false, message: "Too may requests. Please try again later."},
});
app.use('/api/', limiter);

app.use('/api/auth', require('./routes/authRoutes'));

//handler

app.use((req, res)=>{
    res.status(404).json({
        success: false, message:"Route not found."});
});

app.use((err, req, res, next)=>{
    console.error("Global error:", err);
    res.status(500).json({
        success:false, message:"Internal server error."
    });

});
module.exports = app;
