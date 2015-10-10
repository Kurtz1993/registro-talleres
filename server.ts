import cluster    = require('cluster');
import express    = require('express');
import path       = require('path');
import mongo      = require('mongodb');
import bodyParser = require('body-parser');
import os         = require('os');

var cpuCores:number = os.cpus().length;

if(cluster.isMaster){
  console.log("Server has " + cpuCores + " cores.");
  console.log("Initializing server instances...");
  for(var i=0; i<cpuCores * 2; i++){
    cluster.fork();
  }
  cluster.on("online", () => {
    console.log("Instance ready.");
  });
} else {
  var app                           = express();
  var MongoClient                   = mongo.MongoClient;
  var dbUrl:string                  = 'mongodb://localhost:27017/semanaMedico';
  var Talleres:mongo.Collection     = null;
  var Registro:mongo.Collection     = null;
  var Alumnos:mongo.Collection      = null;
  
  MongoClient.connect(dbUrl, (err, database) => {
    if (err) {
      console.log(err);
    } else {
      Talleres  = database.collection('talleres');
      Registro  = database.collection('registro');
      Alumnos   = database.collection('alumnos');
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
    Talleres.find().sort({name:1}).toArray((err, docs) => {
      if (err) { console.log(err); }
      else { res.send(docs); }
    });
  });
  
  app.get('/api/workshops/:workshop/students', (req, res) => {
    Alumnos.find({idTaller: parseInt(req.params.workshop)}).toArray((err, docs) => {
      if (err) { console.log(err); }
      else { res.send(docs); }
    });
  });
  
  app.post('/api/register', (req, res) => {
    var response = {
      success: false,
      data: "Ha ocurrido un error al intentar registrarse, por favor intenta de nuevo más tarde."
    };
    var student = req.body;
    student.idTaller = parseInt(student.idTaller);
    
    Talleres.find({ _id: student.idTaller }).toArray((error, workshop) => {
      var limit:number = workshop[0].total;
      Alumnos.find({ idTaller: student.idTaller }).toArray((err, docs) => {
        if (docs.length >= limit) {
          response.data = "El taller ya está lleno.";
          res.send(response);
        } else {
          var serverResponse = response;
          Alumnos.find({ idTaller: student.idTaller, accountNumber: student.accountNumber }).toArray((err, docs) => {
            if (docs.length === 0) {
              Alumnos.insert(req.body, (err, result) => {
                if (!err) {
                  serverResponse.success = true;
                  serverResponse.data = "¡Te has registrado correctamente!";
                }
                res.send(serverResponse);
              });
            } else {
              serverResponse.data = "Ya estás registrado en este taller.";
              res.send(serverResponse);
            }
          });
        }
      });
    });
  });
  // End API calls...
  
  app.listen(4500, () => {
    console.log("Listening at port 4500");
  });
}