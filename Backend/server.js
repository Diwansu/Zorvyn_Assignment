const express = require('express');
const app = express(); //everything runs through this object
const cors = require('cors'); //cors lets frontend talk to backend.
const dotenv = require('dotenv'); //dotenv helps us use .env file. .env file stores secret values which wil be ignored in .gitignore
const mongoose = require('mongoose'); //mongoose helps us connect to mongodb

// We're routing models
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

// These are Custom Middlewares
const { errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config(); //we're telling the app to load the .env file.
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI).then(
    () => { console.log('Connected to MongoDB') },
    err => {
        console.error('Error connecting to MongoDB:', err);
    }
); // Promise of connecting to database

app.use(cors());
app.use(express.json()); // app.use is for middleware. The above is builtin middleware. Middelwares means functions that run before the request reaches the route handler.

// We're routing models
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

// Basic root endpoint (It's like home page of backend)
app.get('/', (req, res) => {
    res.send('Zorvyn Finance API is running...');
});

// Error Handling Middleware
app.use(errorHandler);

// Starting the server and it listened to PORT. PORT is also related to process and thread of OS Concept. 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 