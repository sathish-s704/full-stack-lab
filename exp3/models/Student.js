const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    rollno: String,
    department: String
});

module.exports = mongoose.model('Student', studentSchema);
