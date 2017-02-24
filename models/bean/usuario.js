// https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Classes

module.exports = class Usuario {
	/**
	 * @param {String} username - required
	 * @param {NumberArray} questoes
	 * @param {NumberArray} pendentes
	 */
	constructor(username, questoes, pendentes){
		this.username = username
		this.questoes = questoes || []
		this.pendentes = pendentes || []
	}
}
