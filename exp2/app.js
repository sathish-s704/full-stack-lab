const express       = require('express');
const exphbs        = require('express-handlebars');
const bodyParser    = require('body-parser');
const session       = require('express-session');
const fs            = require('fs-extra');
const path          = require('path');

const app  = express();
const PORT = 3000;

// ─── Handlebars setup with range helper ─────────────────────────
const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    range: function (start, end, options) {
      let out = '';
      for (let i = start; i <= end; i++) {
        out += options.fn(i);
      }
      return out;
    }
  }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// ─── Middleware ────────────────────────────────────────────────
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}));

// ─── Routes ────────────────────────────────────────────────────
app.get('/', (req, res) => res.redirect('/personal'));

app.get('/personal', (req, res) => {
  res.render('personal', { title: 'Personal Details' });
});

app.post('/personal', (req, res) => {
  req.session.personal = req.body;
  res.redirect('/course');
});

app.get('/course', (req, res) => {
  if (!req.session.personal) return res.redirect('/personal');
  res.render('course', { title: 'Course Registration' });
});

app.post('/course', async (req, res) => {
  const submission = {
    personal: req.session.personal,
    course: req.body,
    time: new Date().toISOString(),
  };

  const file = path.join(__dirname, 'data', 'submissions.json');
  const list = await fs.readJson(file).catch(() => []);
  list.push(submission);
  await fs.outputJson(file, list, { spaces: 2 });

  req.session.latest = submission;
  req.session.personal = null;
  res.redirect('/details');
});

app.get('/details', (req, res) => {
  const data = req.session.latest;
  if (!data) return res.redirect('/personal');
  res.render('details', { ...data, title: 'Registration Summary' });
});

app.get('/all', async (req, res) => {
  const file = path.join(__dirname, 'data', 'submissions.json');
  const list = await fs.readJson(file).catch(() => []);
  res.json(list);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
