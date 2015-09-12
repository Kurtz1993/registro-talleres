import express    = require('express');
import path       = require('path');
import mongo      = require('mongodb');
import bodyParser = require('body-parser');

var app         = express();
var MongoClient = mongo.MongoClient;
var dbUrl       = 'mongodb://localhost:27017/semanaMedico';
var Talleres    = null;
var Registro    = null;

MongoClient.connect(dbUrl, (err, database) => {
  if (err) {
    console.log(err);
  } else {
    Talleres = database.collection('talleres');
    Registro = database.collection('registro');
  }
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Application path...
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API calls...
app.get('/api/workshops', (req, res) => {
  Talleres.find().toArray((err, docs) => {
    if (err) { console.log(err); }
    else { res.send(docs); }
  });
});

app.get('/api/workshops/:workshop/students', (req, res) => {
  res.send('Hello, world!' + JSON.stringify(req.params));
});

app.post('/api/registrar', (req, res) => {
  res.send(req.body);
});
// End API calls...

app.listen(3000, () => {
  console.log("Listening at port 3000");
});