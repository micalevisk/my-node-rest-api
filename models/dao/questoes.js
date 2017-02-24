var restful = require('node-restful');
var mongoose = restful.mongoose;

// http://mongoosejs.com/docs/schematypes.html
var questoesSchema = new mongoose.Schema({
	numero: Number,
	username: String,
	username: String,
});

// return the model to use
module.exports = mongoose.model('Questoes', questoesSchema);