/**
 * API PARA O CONSUMO ÚTIL DO TELEGRAM BOT @forca_tarefa_bot
 * ---------------------------------------------------------
 * @author Micael Levi
 * @version 0.19-2 (02/19)
 * 
 * Express API http://expressjs.com/en/api.html
 * @see https://www.youtube.com/watch?v=p-x6WdwaJco
 * @see http://stackoverflow.com/questions/17007997/how-to-access-the-get-parameters-after-in-express
 * @see https://html5hive.org/how-to-create-rest-api-with-node-js-and-express/
 */


// ============================================ //
require('dotenv').load({ path: __dirname + '/__private__/.env' })
const _ = require('./utils')

var express   = require('express')
var bodyParser= require('body-parser')
var jwt       = require('jwt-simple')

const Usuario = require('./models/bean/usuario')
const Questao = require('./models/bean/questao')
const ResponseMessage = require('./reponse_message')

var infos = require( _.routePath('infos') );
// ============================================ //

/////////////
var resources = require('./resources');
/////////////



// =========================================================================== //
var app = express();
app.set('json spaces', 40);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/resources/infos', infos); // ~/resources/infos


app.use(function (req,res,next) { // rastrear acessos
    console.log(`/${req.method}${req.url}`);
    next();
});

app.get('/', function(req, res){
    res.sendFile( _.page('index') );
});
/*
app.get('/', function (req, res) {
    res.send(`Banco Reservado ao ${'Tio Ed'.asBold()}`); // na página inicial
});
*/

app.get('/resources', function(req, res) {
    res.send(resources);
});

// ---------------------------------------------------> OAuth 2.0
/*
const SECRET_KEY   = process.env.SECRET_KEY;
const SECRET_VALUE = process.env.SECRET_VALUE;

app.set(SECRET_KEY, SECRET_VALUE);

var TOKEN = jwt.encode({ iss: 'ios' }, app.get(SECRET_KEY));
console.log('~> token:', TOKEN);
*/
// ---------------------------------------------------<

/// iniciar Routes
;(function(){
    Object.keys(resources).forEach((p) => {
        let cbGet = (req, res, next) => {
            res.json(resources[p]);
            /*
            var access_token = (req.query && req.query.access_token) || (req.headers['x-access-token']);
            if(access_token){
                try{
                    jwt.decode(access_token, app.get(SECRET_KEY));
                    res.json(resources[p]);
                }catch(err){
                    res.sendStatus(400);
                }
            }
            else next();
            */
        }

        app.get(`/resources/${p.substr(1)}`, cbGet);
    });
})();
// =========================================================================== //


/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

function findUsuarioByUsername(username){
    let store_usuarios = resources._usuarios;
    return store_usuarios.find(u => u.username === username);
}


/**
 * Recuperar informações de um usuário.
 * @param {String} username - nick do telegram
 * @return {Usuario} - ou {ResponseMessage} em caso de erros
 */
app.get('/resources/usuarios/:username', function(req, res) {
    let username = req.params.username;
    let response = new ResponseMessage('Usuário não encontrado', true);

    let usuario = findUsuarioByUsername(username);

    if(usuario) response = usuario;
    else res.status(404);

    res.json(response);
});

/**
 * Adicionar (se não existir) uma questão (número) ao array de questões (e pendentes) de um usuário.
 * @param {String} username  - nick do usuário
 * Query Strings / body:
 * @param {Number} numero    - (required) número da questão que será adicionada
 * @param {Boolean} pendente - indica se será adicionada ou não à lista de pendências
 */
app.post('/resources/usuarios/:username/adicionarQuestao', function(req, res) {
    let username = req.params.username;
    let qParams = req.query;
    let bodyParams = req.body || req.headers['x-www-form-urlencoded'];
    let data = _.chooseValid(qParams, bodyParams);
    let numero = _.toNumber(data.numero);
    let response = new ResponseMessage(`A questão ${numero} foi adicionada às listas de questões de ${username}`);

    let usuario = findUsuarioByUsername(username);

    if(!_.isValid(usuario)){ // verifica se o usuário existe na lista de usuários
        response.setError();
        response.setMessage(`O usuário ${username} não foi encontrado`);
        res.status(404);
    }
    else if(!_.isValid(numero)){ // verifica se a questão é um número válido e foi passado por parâmetro
        response.setError();
        response.setMessage(`Número de questão inválido`);
        res.status(505);
    }
    else{ // adicionar a questão à lista de questões do usuário encontrado
        let questoesUsuario = _.chooseValid(usuario.questoes, []);
        if(questoesUsuario.contains(numero)){ // verifica se o usuário já possui esta questão
            response.setError(false); // não é considerado um erro
            response.setMessage(`A questão ${numero} já está na lista de questões de ${username}`);
        }
        else questoesUsuario.push(numero);

        let pendentesUsuario = _.chooseValid(usuario.pendentes, []);
        if(data.hasOwnProperty('pendente') && Boolean(data.pendente) === true){ // verifica se é para ser adicionada à lista de pendências
            if(pendentesUsuario.contains(numero)){ // verifica se já está na mesma
                response.setError(false); // não é considerado um erro
                response.setMessage(`A questão ${numero} já está na lista de pendências de ${username}`);
            }
            else pendentesUsuario.push(numero);
        }
    }

    res.send(response);
});


/* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */

function findQuestaoByNumero(numero){
    var store_questoes = resources._questoes;
    let cb = (q) => q.numero === parseInt(numero);
    return store_questoes.find(cb);
}

/**
 * Recuperar informações de uma questão pelo seu número.
 * @param {Number} numero - (require) número da questão
 * @return {Questao}
 */
app.get('/resources/questoes/:numero', function(req, res) {
    let params = req.params;
    let numero = _.toNumber(params.numero);
    let response = findQuestaoByNumero(numero);

    if(!_.isValid(response)){
        response = new ResponseMessage('Questão não encontrada!', true);
        res.status(404);
    }

    res.json(response);
});

/**
 * Inserir uma nova questão.
 * Query Strings / body:
 * @param {Number} numero    - (require) número da questão
 * @param {String} enunciado - (require) enunciado da questão
 * @param {String} resposta  - resposta da questão
 * @return {ResponseMessage}
 */
app.post('/resources/questoes', function(req, res) {
    let qParams = req.query;
    let bodyParams = req.body || req.headers['x-www-form-urlencoded'];
    let data = _.chooseValid(qParams, bodyParams);
    let store_questoes = resources._questoes;
    let store_infos    = resources._infos;
    let response = new ResponseMessage('Inserido com sucesso!');

    let numero    = _.toNumber(data.numero);
    let enunciado = data.enunciado
    let resposta  = data.resposta || "";
    
    let questaoAntiga = findQuestaoByNumero(numero);

    if(!_.isValid(numero) || typeof numero !== 'number' || numero < 1){
        response.setError();
        response.setMessage('Número inválido ou indefinido');
        res.status(500);
    }
    else if(!_.isValid(enunciado) || typeof enunciado !== 'string' || enunciado.isEmpty()){
        response.setError();
        response.setMessage('Enunciado inválido');
        res.status(500);
    }
    else{
        let novaQuestao = new Questao(numero, enunciado, qParams.resposta);
        if(_.isValid(questaoAntiga)){
            response.setError();
            response.setMessage('Essa questão já existe');
            res.status(500);
        }
        else{
            store_questoes.push(novaQuestao);
            store_infos.qtd_questoes++;
        }
    }

    res.json(response);
});

/**
 * Alterar alguma informação (enunciado/resposta) sobre uma questão pelo seu número.
 * @param {Number} numero    - (require) número da questão
 * Query Strings / body:
 * @param {String} enunciado - enunciado da questão
 * @param {String} resposta  - resposta da questão
 * @return {ResponseMessage}
 */
app.put('/resources/questoes/:numero', function(req, res) {
    let params = req.params;
    let qParams = req.query;
    let bodyParams = req.body || req.headers['x-www-form-urlencoded'];
    let data = _.chooseValid(qParams, bodyParams);
    let numero = _.toNumber(params.numero);
    let response = new ResponseMessage('Alterado com sucesso!');

    let questao = findQuestaoByNumero(numero);
    if(!_.isValid(questao)){
        response.setError();
        response.setMessage('Essa questão não existe');
        res.status(500);
    }
    else{
        questao.enunciado = data.enunciado || questao.enunciado;
        questao.resposta  = data.resposta  || questao.resposta;
    }

    res.json(response);
});

/**
 * Apagar uma questão pelo seu número.
 * @param {Number} numero
 * @return {ResponseMessage}
 */
app.delete('/resources/questoes/:numero', function(req, res) {
    let params = req.params;
    let numero = _.toNumber(params.numero);
    let store_questoes = resources._questoes;
    let response = new ResponseMessage(`A questão ${numero} foi Apagada com sucesso!`);

    let questao = findQuestaoByNumero(numero);
    if(!_.isValid(questao)){
        response.setError();
        response.setMessage('Essa questão não existe');
        res.status(404);
    }
    else{
        resources._questoes = resources._questoes.filter((q) => q.numero !== numero);
    }

    res.json(response);
});



//////////////
module.exports = app;
//////////////