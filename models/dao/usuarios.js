var restful = require('node-restful');
var mongoose = restful.mongoose;

// http://mongoosejs.com/docs/schematypes.html
var usuariosSchema = new mongoose.Schema({
	username: String,
	questoes: [],
	pendentes: []
});

// return the model to use
module.exports = mongoose.model('Usuarios', usuariosSchema);