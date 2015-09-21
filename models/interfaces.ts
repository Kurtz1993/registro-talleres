import mongo = require('mongodb');
interface ITaller {
	_id: number,
	name: string,
	dr: string,
	time: string,
	day: string,
	description: string,
	total: number
}

interface IAlumno {
	_id: mongo.ObjectID,
	name: string,
	accountNumber:string,
	idTaller: number
}