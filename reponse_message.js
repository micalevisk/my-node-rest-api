module.exports =
class ResponseMessage {
	/**
	 * @param {String} message
	 * @param {Boolean} error - default: false
	 */
	constructor(message, error=false){
		this.message = message;
		this.error = error;
	}

	setError(error=true){
		this.error = error;
	}

	setMessage(message=""){
		this.message = message;
	}

	/**
	 * @param {Object} properties - (optional) mais propriedades
	 */
	append(properties){
		if(properties && typeof properties === 'object')
			for(var p in properties) this[p] = properties.p;
	}
}