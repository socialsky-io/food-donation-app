require('dotenv').config();
var mongoose = require('mongoose');

var mongoDBURL = process.env.MONGODB_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(mongoDBURL || 'mongodb://127.0.0.1:27017/express_app_1', {
            useNewUrlParser: true,
            useUnifiedTopology: true 
        });
        console.log('Connected to MongoDB !!!', mongoDBURL)
    } catch(err) {
        console.error('error', err);
        process.exit();
    }
}

module.exports = connectDB;