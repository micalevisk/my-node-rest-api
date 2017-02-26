const express = require('express');
const router = express.Router();

const _ = require('../utils');
const ResponseMessage = require('../reponse_message');

const resources = require('../resources');

/**
 * Alterar alguma informação global.
 * Query Strings / body:
 * @param {Number} qtd_questoes
 * @param {String} versao           - format: "x (dd/mm)"
 * @param {String} data_respostas   - format: "dd/mm"
 * @param {String} data_lista       - format: "dd/mm"
 * @return {Object}
 */
router.put('/', function(req, res, next) {
    let qParams = req.query;
    let bodyParams = req.body || req.headers['x-www-form-urlencoded'];
    let data = _.chooseValid(qParams, bodyParams);
    let store_infos = resources._infos;
    let response = new ResponseMessage('Informações alteradas com sucesso!');

    if(!_.isValid(data)){ 
        response.setError();
        response.setMessage('Informações não alteradas');
        res.status(500);
    }
    else {
		let arrKeysParams = Object.keys(data);
		let allValid = true; // admite que todos os argumentos são propriedades no '/infos'
		arrKeysParams.forEach((k) => { // verifica se todos os argumentos são válidos
			if(!store_infos.hasOwnProperty(k)){
				allValid=false;
				return;
			}
		});

		if(allValid){
        	let qtd_questoes = _.toNumber(data.qtd_questoes);
        	store_infos.qtd_questoes    = qtd_questoes ? qtd_questoes : store_infos.qtd_questoes;
        	store_infos.versao          = data.versao         || store_infos.versao;
        	store_infos.data_respostas  = data.data_respostas || store_infos.data_respostas;
        	store_infos.data_lista      = data.data_lista     || store_infos.data_lista;
		}
		else{
			response.setError();
			response.setMessage('Há chave(s) inválida(s)');
		}
    }

    res.send(response);
});



//////////////
module.exports = router;
//////////////