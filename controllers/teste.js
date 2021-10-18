const teste = require('../models/teste.model')   /* CADA CONTROLER CHAMA SEU MODELO */
const colors = require('colors')
const axios = require('axios')
const date = require('date-and-time');


module.exports = app => {
    /* TO BYPASS CORS POLICY!*/
    app.use(function (req, res, next) {
        res.setHeader(
            "Access-Control-Allow-Headers",
            "X-Requested-With,content-type"
        );
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "GET, POST, OPTIONS, PUT, PATCH, DELETE"
        );
        res.setHeader("Access-Control-Allow-Credentials", true);
        next();
    });

    /***
     * ! ***************************
     * ! API ROUTES
     * ! ***************************
     */


    // ?API DE TESTE DE ROTA DO DECODER
    app.get('/api/teste/teste', (req, res) => {
        res.status(200).json({
            success: true,
            msg: "Chamou DECODER",
        })
    })

    app.route('/api/teste/teste').post(async (req, res, next) => {
        const id_origem = 1
        const newTeste = new teste({ id_origem });
        try {
            await newTeste.save()
            return res.status(200).json({ success: true, teste: newTeste })
        } catch (error) {
            return res.status(401).json({ success: false, message: error })
        }
    });


}