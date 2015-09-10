import express  = require('express');
import path     = require('path');
import bodyParser = require('body-parser');

var app = express();
var api = require('./api/api');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', api);
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.listen(3000, () => {
    console.log("Listening at port 3000");
});