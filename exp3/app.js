const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const Student = require('./models/Student');

const app = express();
const PORT = 3000;

// DB Connection
mongoose.connect('mongodb+srv://sathishskr371:sathish2004@pythonpro.hpd10yr.mongodb.net/studentDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
    const students = await Student.find();
    res.render('index', { students });
});

app.get('/add', (req, res) => {
    res.render('form');
});

app.post('/add', async (req, res) => {
    const { name, rollno, department } = req.body;
    await Student.create({ name, rollno, department });
    res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('edit', { student });
});

app.post('/edit/:id', async (req, res) => {
    const { name, rollno, department } = req.body;
    await Student.findByIdAndUpdate(req.params.id, { name, rollno, department });
    res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
