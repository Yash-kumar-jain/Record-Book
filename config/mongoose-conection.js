const mongoose = require('mongoose');

// mongoose.connect(process.env.MONGODB_URI).then( ()=> {
//     console.log("connected to database ");
// });

// module.exports = mongoose.connection;

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));