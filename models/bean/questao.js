module.exports = class Questao {
	/**
	 * @param {Number} numero - required
	 * @param {String} enunciado - required
	 * @param {String} resposta
	 */
	constructor(numero, enunciado, resposta){
		this.numero = numero;
		this.enunciado = enunciado;
		this.resposta = resposta || "";
	}
}
