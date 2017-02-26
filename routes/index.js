const express = require('express');
const router = express.Router();


router.get('/', function(req, res, next){

	res.render('index', {
		title: 'Força Tarefa Bot'
		,header: 'API <u>/resources</u> endpoints'

		,absolute: '/resources'
		,items: [
			 { first: 'GET', second: '/usuarios' }
			,{ first: 'GET', second: '/questoes' }
			,{ first: 'GET', second: '/infos' }
		]
	});

});



//////////////
module.exports = router;
//////////////