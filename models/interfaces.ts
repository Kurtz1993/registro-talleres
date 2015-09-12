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
	_id: string,
	name: string,
	idTaller: number
}