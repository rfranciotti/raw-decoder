const express = require('express') /* framework for nodejs */
const consign = require('consign') /*auxiliar na organização das pasta do projeto.*/
const errorHandler = require('../middleware/erros')


/* configuracao do express */
const api = express();
api.use(errorHandler)
api.use(express.urlencoded({ extended: true }))
api.use(express.json())

consign()
    .include('/controllers')   /* Arquivo CUSTOM Chama TODOS do diretorio CONTROLLERS - ATRAVES DO CONSIGN NO CARREGAMENTO INICIAL*/
    .into(api)

module.exports = api;