# My first REST API
> todo example [Creating a Simple RESTful Web App with Node.js, Express, and MongoDB](http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/) <br>
> vide [Design de API REST, em 7 dicas simples](http://sensedia.com/blog/apis/design-de-api-rest) <br>
> vide [Construindo uma API Rest com ExpressJS - NodeJS](https://pt-br.eventials.com/wbruno.moraes/construindo-uma-api-rest-com-expressjs-nodejs-2/) <br>
> vide [Build a RESTful API Using Node and Express 4](https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4) <br>
> read [Boas Práticas JS](https://github.com/wbruno/boas-praticas-js) <br>
> view api doc sample https://github.com/justintv/Twitch-API/blob/master/v3_resources/channels.md <br>
> view api doc sample https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md <br>
> view content dispose https://github.com/typicode/json-server <br>
> vide JADE example [How to Use Jade and Handlebars in Express.js](https://webapplog.com/jade-handlebars-express/) <br>

# ¬ TODO
- [ ] documentação na página HTML
- [ ] exemplos de cada método (usando o cURL)
- [ ] autenticação OAuth 2.0
- [ ] organizar seguindo:
	```
	├── raiz
	│     ├── app.js
	│     ├── bin
	│     │    └── www
	│     ├── controllers/
	│     ├── middlewares/
	│     └── routes/
	```

----------

# § métodos

## GET geral AKA endpoints
- [x] `~/usuarios` recupera os usuários
- [x] `~/questoes` recupera as questões
- [x] `~/infos` recupera informações gerais sobre o estado corrente da lista

### ~ USUARIOS
- [x] `GET    ~/usuarios/:username` recupera informações de um usuário
- [x] `GET    ~/search/usuarios/:username` recupera informações de um usuário (substituir o de cima ^)
- [ ] `POST   ~/usuarios/:username?...` insere um usuário (se não houver um com o mesmo nick)
- [ ] `PUT    ~/usuarios/:username?...` altera as informações de um usuário
- [ ] `DELETE ~/usuarios/:username` apaga um usuário pelo seu nick
- [x] `POST   ~/usuarios/:username/adicionarQuestao?numero=...&pendente=...` adiciona uma questão (número) à lista de questões (e pendências) do usuário
- [ ] `DELETE ~/usuarios/:username/removerPendente?numero=...` remove uma questão (número) da lista de pendências do usuário
- [ ] `DELETE ~/usuarios/:username/removerQuestao?numero=...` remove uma questão (número) da lista de questões e pendências do usuário

### ~ QUESTOES 
- [x] `GET    ~/questoes/:numero` recupera informações de uma questão pelo seu número
- [x] `GET    ~/search/questoes/:numero` recupera informações de uma questão pelo seu número (substituir o de cima ^)
- [x] `POST   ~/questoes?numero=...&enunciado=...` insere uma *nova* questão
- [x] `PUT    ~/questoes/:numero` altera as informações de uma questão pelo seu número
- [x] `DELETE ~/questoes/:numero` apaga uma questão pelo seu número

### ~ INFOS
- [x] `PUT ~/infos?...` altera as informações globais

---

<!--
### `GET /usuarios/:username`

|	Param	 |	Type	  | Description			|
|:----------:|:----------:|:-------------------:|
| *username* | `String`	  | nick do Telegram	|

> retorna:
```js
{
	username: "",
	questoes: [],
	pendentes: []	
}
```
-->