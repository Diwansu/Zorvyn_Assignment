const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
const PORT = process.env.PORT ||3000;

mongoose.connect(process.env.MONGO_URI).then(
    ()=>{ console.log('Connected to MongoDB')},
    err=>{
    console.error('Error connecting to MongoDB:', err);
})



app.use(cors());
app.use(express.json());

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})