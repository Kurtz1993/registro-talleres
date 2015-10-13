var cluster = require('cluster');
var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var os = require('os');
var cpuCores = os.cpus().length;
if (cluster.isMaster) {
    console.log("Server has " + cpuCores + " cores.");
    console.log("Initializing server instances...");
    for (var i = 0; i < cpuCores * 2; i++) {
        cluster.fork();
    }
    cluster.on("online", function () {
        console.log("Instance ready.");
    });
}
else {
    var app = express();
    var MongoClient = mongo.MongoClient;
    var dbUrl = 'mongodb://localhost:27017/semanaMedico';
    var Talleres = null;
    var Registro = null;
    var Alumnos = null;
    MongoClient.connect(dbUrl, function (err, database) {
        if (err) {
            console.log(err);
        }
        else {
            Talleres = database.collection('talleres');
            Registro = database.collection('registro');
            Alumnos = database.collection('alumnos');
        }
    });
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/', function (req, res) {
        res.sendFile(path.join(__dirname, 'index.html'));
    });
    app.get('/api/workshops', function (req, res) {
        Talleres.find().sort({ name: 1 }).toArray(function (err, docs) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(docs);
            }
        });
    });
    app.get('/api/workshops/:workshop/students', function (req, res) {
        Alumnos.find({ idTaller: parseInt(req.params.workshop) }).toArray(function (err, docs) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(docs);
            }
        });
    });
    app.post('/api/register', function (req, res) {
        var response = {
            success: false,
            data: "Ha ocurrido un error al intentar registrarse, por favor intenta de nuevo más tarde."
        };
        var student = req.body;
        student.idTaller = parseInt(student.idTaller);
        Talleres.find({ _id: student.idTaller }).toArray(function (error, workshop) {
            var limit = workshop[0].total;
            Alumnos.find({ idTaller: student.idTaller }).toArray(function (err, docs) {
                if (docs.length >= limit) {
                    response.data = "El taller ya está lleno.";
                    res.send(response);
                }
                else {
                    var serverResponse = response;
                    Alumnos.find({ idTaller: student.idTaller, accountNumber: student.accountNumber }).toArray(function (err, docs) {
                        if (docs.length === 0) {
                            Alumnos.insert(req.body, function (err, result) {
                                if (!err) {
                                    serverResponse.success = true;
                                    serverResponse.data = "¡Te has registrado correctamente!";
                                }
                                res.send(serverResponse);
                            });
                        }
                        else {
                            serverResponse.data = "Ya estás registrado en este taller.";
                            res.send(serverResponse);
                        }
                    });
                }
            });
        });
    });
    app.use(function (req, res, next) {
        res.redirect('/');
    });
    app.listen(4500, function () {
        console.log("Listening at port 4500");
    });
}
