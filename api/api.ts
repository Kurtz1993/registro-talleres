import express	= require('express');
import mongo		=	require('mongodb');

var router			=	express.Router();
var MongoClient	=	mongo.MongoClient;
var url					=	'mongodb://localhost:27017/test'

/* Workshops list */
router.get('/workshops', (req, res) => {
	res.send('Aquí irán los talleres');
});

/* Students list per scpeficied workshop */
router.get('/workshops/:workshop/students', (req, res) => {
	res.send(req.params);
	/* MongoClient.connect(url, (err, db) => {
		if(err)
			console.log(err);
		db.collection('hello').find().toArray((err, docs) => {
			results = docs;
			console.log(results);
		});
	});
	*/
});

module.exports = router;