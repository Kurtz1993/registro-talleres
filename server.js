var cluster = require('cluster');
var express = require('express');
var path = require('path');
var mongo = require('mongodb');
var bodyParser = require('body-parser');
var os = require('os');
var cpuCores = os.cpus().length;
/*if (cluster.isMaster) {
  console.log("Initializing server instances...");
  for (var i = 0; i < cpuCores * 2; i++) {
    cluster.fork();
  }
  cluster.on("online", function () {
    console.log("Instance ready.");
  });
}
else {*/
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
  app.get('/api/workshops', function (req, res){
    var response = {
      success: false,
      data: null
    };
    Talleres.find().sort({ name: 1 }).toArray(function (err, docs){
      if(err){
        response.data = "Ha ocurrido un error. Por favor intenta de nuevo más tarde.";
      } else {
        response.success = true;
        response.data = docs;
      }
      res.send(response);
    });
  });
  app.get('/api/workshop/:id', function (req, res){
    var response = {
      success: false,
      data: null
    };
    Talleres.find({ _id: parseInt(req.params.id) }).sort({ name: 1 }).toArray(function (err, docs){
      if(err){
        response.data = "Ha ocurrido un error. Por favor intenta de nuevo más tarde.";
      } else {
        response.success = true;
        response.data = docs[0];
      }
      res.send(response);
    });
  });
  app.get('/api/workshops/:semester', function (req, res) {
    Talleres.find({ semester: parseInt(req.params.semester) }).sort({ name: 1 }).toArray(function (err, docs) {
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
    student.semester = parseInt(student.semester);
    student.idTaller = parseInt(student.idTaller);
    var firstMinThreshold = 1444935600790;
    var firstMaxThreshold = 1444971600790;
    var thirdMinThreshold = 1444935600790;
    var thirdMaxThreshold = 1444971600790;
    var fifthMinThreshold = 1445022000790;
    var fifthMaxThreshold = 1445058000790;
    var now = Date.now();
    /**
     * Register a student with the given student object
     * @param student Object: The object that contains student info.
     * @param res Object: Express.js response object.
     * @param response: Object: The response object that the server will send to the API call.
     */
    function register(student, res, response) {
      Talleres.find({ _id: student.idTaller }).toArray(function (error, workshop) {
        var limit = workshop[0].total;
        student.dayId = workshop[0].dayId;
        Alumnos.find({ idTaller: student.idTaller }).toArray(function (err, docs) {
          if (docs.length >= limit) {
            response.data = "El taller ya está lleno.";
            res.send(response);
          }
          else {
            var serverResponse = response;
            Alumnos.find({ idTaller: student.idTaller, accountNumber: student.accountNumber }).toArray(function (err, docs) {
              if (docs.length === 0) {
                Alumnos.find({accountNumber:student.accountNumber, dayId: student.dayId}).toArray(function(err, docs){
                  var respuesta = serverResponse;
                  var servidor = res;
                  if(docs.length === 0){
                    Alumnos.insert(req.body, function (err, result) {
                      if (!err) {
                        respuesta.success = true;
                        respuesta.data = "¡Te has registrado correctamente!";
                      }
                      servidor.send(respuesta);
                    });
                  } else {
                    serverResponse.data = "¡Ya te has registrado a un taller para estos días!";
                    res.send(serverResponse);
                  }
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
    }

    if (((now >= firstMinThreshold && now <= firstMaxThreshold) && student.semester === 1) ||
      ((now >= thirdMinThreshold && now <= thirdMaxThreshold) && student.semester === 3) ||
      ((now >= fifthMinThreshold && now <= fifthMaxThreshold) && student.semester === 5)) {
      if (student.idTaller === 42) {
        student.timestamp = Date.now();
        Alumnos.find({ idTaller: 29, accountNumber: student.accountNumber }).toArray(function (err, docs) {
          if (docs.length > 0) {
            register(student, res, response);
          } else {
            response.data = "No puedes registrarte debido a que no participaste en el taller anterior.";
            res.send(response);
          }
        });
      } else {
        register(student, res, response);
      }

    } else {
      switch (student.semester) {
        case 1:
          response.data = "¡El horario de registro para primer semestre es el Jueves 15 de Octubre de 2:00 PM a 12:00 AM!"
          break;
        case 3:
          response.data = "¡El horario de registro para tercer semestre es el Jueves 15 de Octubre de 2:00 PM a 12:00 AM!"
          break;
        case 5:
          response.data = "¡El horario de registro para quinto semestre es el Viernes 16 de Octubre de 2:00 PM a 12:00 AM!"
          break;
      }
      res.send(response);
    }
  });
  app.use(function (req, res, next) {
    res.redirect('/');
  });
  app.listen(4500, function () {
    console.log("Listening at port 4500");
  });
//}