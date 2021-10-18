const decoder = require('../models/decoder.model')   /* CADA CONTROLER CHAMA SEU MODELO */
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

    require('dotenv').config();
    var type_env = process.env.NODE_ENV

    if (type_env === "development") {
        url = process.env.url_dev
        console.log("")
        console.log("--------------------------------------------------".rainbow)
        console.log(process.env.author + " - API SISTEMA VTS")
        console.log(`Status mode: ${process.env.NODE_ENV.brightBlue}`);
        console.log("ENV -> " + "DEV ->".green, url);

    } else {

        url = process.env.url_prd
        console.log("")
        console.log("--------------------------------------------------".rainbow)
        console.log(process.env.author + " - API SISTEMA VTS")
        console.log(`Status mode: ${process.env.NODE_ENV.brightRed}`);
        console.log("ENV -> " + "PRD ->".green, url);
    }


    /***
     * ! ***************************
     * ! API ROUTES
     * ! ***************************
     */


    // ?API DE TESTE DE ROTA DO DECODER
    app.get('/api/decoder/test', (req, res) => {
        res.status(200).json({
            success: true,
            msg: "Chamou DECODER",
        })
    })

    // ?API DE TESTE DE ROTA QUE CHAMA OUTRA API POR AXIOS
    app.get('/api/decoder/rest', (req, res) => {
        axios.get(url + '/api/decoder/test')
            .then(function (response) {
                /* console.log(response.data); */
                return res.status(200).json({
                    success: response.data.success,
                    message: response.data.msg
                })
            })
            .catch(function (error) {
                res.status(400).json({
                    success: false,
                    error: error
                })
            })
    })

    //? API GET - TODOS OS REGISTROS QUE FORAM DECODIFICADOS
    app.route('/api/decoder/').get(async (req, res) => {
        try {
            const gets = await decoder.find({})
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - TRAZ TODOS OS MMSIs QUE FORAM DECODIFICADOS
    app.route('/api/decoder/distinct').get(async (req, res) => {
        try {
            const gets = await decoder.find({}, { mmsi: 1 }).distinct('mmsi')
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - CRIA UM BLOCO PARA PLOT BASEADO EM MINUTOS DOS ULTIMOS DECODERS EFETUADOS
    app.route('/api/decoder/lastblock/:minutes').get(async (req, res) => {
        try {

            /* MONTA AS DATAS INICIAL E FINAL DO BLOCO */
            const gets = await decoder.find({}, { '_id': 0, 'timestamp': 1 }, { sort: { 'timestamp': -1 } }).limit(1)
            const LastDate = new Date(gets[0].timestamp);
            const FirstDate = date.addMinutes(LastDate, req.params.minutes);

            /* MONTA QUERY DE EXECUÇÃO */
            query = decoder.find({ timestamp: { $gte: new Date(FirstDate), $lte: new Date(LastDate) } }, { '_id': 1, 'mmsi': 1, 'longitude': 1, 'latitude': 1, 'heading': 1, 'timestamp': 1 }, { sort: { 'timestamp': 1 } });

            try {
                const gets = await query
                return res.status(200).json({
                    success: true,
                    count: gets.length,
                    data: gets
                })
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: error
                })
            }

        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - TRAZ O ULTIMO MMSI DECODIFICADO
    app.route('/api/decoder/lastdecoder/').get(async (req, res) => {
        try {
            const gets = await decoder.find({}, { '_id': 0, 'mmsi': 1, 'timestamp': 1 }, { sort: { 'timestamp': -1 } }).limit(1)
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - TRAZ A ULTIMA POSIÇÃO DECODIFICADA DE CADA MMSI
    app.route('/api/decoder/lastposition').get(async (req, res) => {

        try {

            /* monta o array de mmsis */
            let arrMMSI = []
            let arrResult = []
            await axios
                .get(url + '/api/decoder/distinct')
                .then(response => {
                    arrMMSI = response.data.data
                })
                .catch(error => {
                    console.log(error.message);
                })

            /* */
            const promises = arrMMSI.map(async (index, key) => {
                const gets = await decoder.find({ mmsi: String(index) }, {}, { sort: { 'timestamp': -1 } })
                datares = { mmsi: gets[0].mmsi, longitude: gets[0].longitude, latitude: gets[0].latitude };

                return (
                    arrResult = [...arrResult, datares]
                )

            })

            // wait until all promises resolve
            const results = await Promise.all(promises)


            return res.status(200).json({
                success: true,
                message: arrResult
            })



        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message
            })
        }

    })

    //? API GET - TRAZ A ULTMA MENSAGEM (COMPLETA) DE UM MMSI ESPECIFICO NO BODY
    app.route('/api/decoder/last').get(async (req, res) => {
        try {
            const gets = await decoder
                .find({ mmsi: req.body.mmsi }, {}, { sort: { 'timestamp': -1 } })
                .limit(1);
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - TRAZ A ULTMA MENSAGEM (COMPLETA) DE UM MMSI ESPECIFICO NO PARAMETRO
    app.route('/api/decoder/last/:mmsi').get(async (req, res) => {

        try {
            const gets = await decoder
                .find({ mmsi: req.params.mmsi }, { _id: 1, mmsi: 1, latitude: 1, longitude: 1, heading: 1, timestamp: 1 }, { sort: { 'timestamp': -1 } })
                .limit(1);
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - TRAZ O HISTORICO DE DECODIFICACAO DO MMSI ORDENADO POR ORDEM DE DECODIFICACAO ASCENDENTE
    app.route('/api/decoder/mmsi/:mmsi').get(async (req, res) => {

        try {
            const gets = await decoder
                .find({ mmsi: req.params.mmsi }, { _id: 1, mmsi: 1, latitude: 1, longitude: 1, heading: 1, timestamp: 1 }, { sort: { 'timestamp': 1 } })
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - TRAZ O HISTORICO POR RANGE DE DATA DE DECODIFICACAO DO MMSI ORDENADO POR ORDEM DE DECODIFICACAO ASCENDENTE
    // ? BODY: dt_inicial(datetime utc), dt_final(datetime utc), complete(boolean opt), mmsi(string opt)
    app.route('/api/decoder/bydate').get(async (req, res) => {

        let query
        let queryStr = JSON.stringify(req.body);
        queryStr = "{$gte: new Date('" + req.body.dt_inicial + "'),"
        queryStr = queryStr + "$lte: new Date('" + req.body.dt_final + "') } "

        const retParams = { _id: 1, mmsi: 1, latitude: 1, longitude: 1, heading: 1, timestamp: 1 }

        if (req.body.hasOwnProperty('complete')) {
            if (req.body.complete) {
                query = decoder.find({ timestamp: { $gte: new Date(req.body.dt_inicial), $lte: new Date(req.body.dt_final) } });
                if (req.body.hasOwnProperty('mmsi')) {
                    query = decoder.find({ mmsi: req.body.mmsi, timestamp: { $gte: new Date(req.body.dt_inicial), $lte: new Date(req.body.dt_final) } });
                } else {
                    query = decoder.find({ timestamp: { $gte: new Date(req.body.dt_inicial), $lte: new Date(req.body.dt_final) } })
                }
            } else {
                if (req.body.hasOwnProperty('mmsi')) {
                    query = decoder.find({ mmsi: req.body.mmsi, timestamp: { $gte: new Date(req.body.dt_inicial), $lte: new Date(req.body.dt_final) } }, retParams);
                } else {
                    query = decoder.find({ timestamp: { $gte: new Date(req.body.dt_inicial), $lte: new Date(req.body.dt_final) } }, retParams);
                }
            }
        }

        try {
            const gets = await query
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })

    //? API GET - TRAZ TODOS OS MMSIs QUE FORAM DECODIFICADOS EM UM RANGE DE LAT E LON
    app.route('/api/decoder/latlong').get(async (req, res) => {

        try {
            const gets = await decoder.find({ longitude: { $lte: req.body.long_min, $gte: req.body.long_max }, latitude: { $lte: req.body.lat_min, $gte: req.body.lat_max } })


            /*             const gets = await decoder.find(
                            {
                                $and: [
                                    { $and: [{ long_min: { $lte: req.body.long_min } }, { long_max: { $gte: req.body.long_max } }] },
                                    { $and: [{ lat_min: { $lte: req.body.lat_min } }, { lat_max: { $gte: req.body.lat_max } }] }
                                ]
                            }, {}) */
            return res.status(200).json({
                success: true,
                count: gets.length,
                data: gets
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error
            })
        }
    })




    /*** 
        * ! MENSAGEM RAW - TRADUTOR (DECODER)
        * ! API PRINCIPAL
        */

    app.route('/api/decoder/raw').post(async (req, res) => {

        var type = ""
        var fragments = ""
        var Radio_channel = ""
        var payload = ""

        var payload_Type = ""
        var payload_Repeat = ""
        var payload_MMSI = ""
        var payload_Status = ""
        var payload_Rate = ""
        var payload_Speed = ""
        var payload_Position = ""
        var payload_Lon = ""
        var payload_Lat = ""
        var payload_Course = ""
        var payload_Heading = ""
        var payload_Maneuer = ""
        var payload_Raim = ""
        var payload_Radio = ""
        var payload_result = ""
        var mystring = ""
        var myInt = 0
        var myDec = 0.00000000000
        var myDec60 = 0.00000000000
        var longitude = 0.00000000000

        var new_time = Date.now()
        var new_raw = req.body.raw

        mystring = req.body.raw
        myIdReceived = req.body.id

        if (mystring.toString().slice(0, 1) === "!") {
            type = mystring.toString().substr(1, 5)
            fragments = mystring.toString().substr(7, 1)
            complete = mystring.toString().substr(9, 1)
            Sequential = mystring.toString().substr(11, 0)
            Radio_channel = mystring.toString().substr(12, 1)
            payload = mystring.toString().substr(14, 28)
            req_payload = mystring.toString().substr(43, 1)


            if (mystring.toString().substr(41, 1) === ",") {
                payload = mystring.toString().substr(14, 27)
                req_payload = mystring.toString().substr(42, 1)
                checksum = mystring.toString().substr(43, 4)
            } else {
                payload = mystring.toString().substr(14, 28)
                req_payload = mystring.toString().substr(43, 1)
                checksum = mystring.toString().substr(44, 3)
            }


            checksum = mystring.toString().substr(44, 3)
        } else {
            type = mystring.toString().substr(0, 5)
            fragments = mystring.toString().substr(6, 1)
            complete = mystring.toString().substr(8, 1)
            Sequential = mystring.toString().substr(10, 0)
            Radio_channel = mystring.toString().substr(11, 1)
            payload = mystring.toString().substr(13, 28)
            req_payload = mystring.toString().substr(42, 1)
            checksum = mystring.toString().substr(43, 3)
        }

        const char_table = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", ":", ";", "<", "=", ">", "?", "@", "A", "B",
            "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "`",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w"]

        const bits_table = ["000000", "000001", "000010", "000011", "000100", "000101", "000110", "000111", "001000", "001001", "001010", "001011",
            "001100", "001101", "001110", "001111", "010000", "010001", "010010", "010011", "010100", "010101", "010110", "010111", "011000",
            "011001", "011010", "011011", "011100", "011101", "011110", "011111", "100000", "100001", "100010", "100011", "100100", "100101",
            "100110", "100111", "101000", "101001", "101010", "101011", "101100", "101101", "101110", "101111", "110000", "110001", "110010",
            "110011", "110100", "110101", "110110", "110111", "111000", "111001", "111010", "111011", "111100", "111101", "111110", "111111"]


        for (var i = 0; i < payload.length; i++) {
            var pos = 0
            var acrescimo = 48
            pos = char_table.indexOf(payload.charAt(i))
            if (pos > 36) {
                acrescimo = 48 + 8
            }
            payload_result = payload_result + bits_table[pos]
        }


        /*PAYLOAD PARSER*/

        payload_Type = payload_result.substr(0, 6)
        payload_Repeat = payload_result.substr(6, 2)
        payload_MMSI = payload_result.substr(8, 30)
        payload_Status = payload_result.substr(38, 4)
        payload_Rate = payload_result.substr(42, 8)
        payload_Speed = payload_result.substr(50, 10)
        payload_Position = payload_result.substr(60, 1)
        payload_Lon = payload_result.substr(61, 28)
        payload_Lat = payload_result.substr(89, 27)
        payload_Course = payload_result.substr(116, 12)

        if (Number(fragments) > 1) {
            return res.status(200).json({
                success: false,
                msg: "Message Not Decoded!",
                content: "Fragments maior que 1",
            })
        }


        payload_Heading = payload_result.substr(128, 9)
        payload_Tstamp = payload_result.substr(137, 6)
        payload_Maneuer = payload_result.substr(143, 2)
        payload_Spare = payload_result.substr(145, 3)
        payload_Raim = payload_result.substr(148, 1)
        payload_Radio = payload_result.substr(149, 19)




        /* ********************************************************************************************* */
        var parse_type = 0
        var numMax = payload_Type.length - 1
        var numSoma = 0
        for (var i = 0; i < payload_Type.length; i++) {
            parse_type = Number(payload_Type.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_type
        }
        parse_type = numSoma


        console.log("MESSAGE TYPE".red, parse_type)

        if (parse_type === 24) {
            return res.status(400).json({
                success: false,
                msg: "Message NOT Decoded!",
                content: "Message Type = 24"
            })
        }

        if (parse_type === 3) {
            parse_type = parse_type + " - Special Position Report"
        }
        if (parse_type === 1) {
            parse_type = parse_type + " - Scheduled Position Report"
        }



        /* ********************************************************************************************* */
        var parse_repeat = 0
        numMax = payload_Repeat.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Repeat.length; i++) {
            parse_repeat = Number(payload_Repeat.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_repeat
        }
        parse_repeat = numSoma
        /* ********************************************************************************************* */
        var parse_mmsi = 0
        numMax = payload_MMSI.length - 1
        numSoma = 0
        for (var i = 0; i < payload_MMSI.length; i++) {
            parse_mmsi = Number(payload_MMSI.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_mmsi
        }
        parse_mmsi = numSoma

        if (parse_mmsi === 999999999) {
            return res.status(400).json({
                success: false,
                msg: "Message NOT Decoded!",
                content: "MMSI Invalid = 999999999"
            })
        }

        console.log(parse_mmsi)


        /* ********************************************************************************************* */
        var parse_status = 0
        numMax = payload_Status.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Status.length; i++) {
            parse_status = Number(payload_Status.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_status
        }
        parse_status = numSoma
        /* ********************************************************************************************* */
        var parse_rate = 0
        numMax = payload_Rate.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Rate.length; i++) {
            if (i === 0) {
                parse_rate = Number(payload_Rate.charAt(i)) * Math.pow(2, numMax) * -1
            } else {
                parse_rate = Number(payload_Rate.charAt(i)) * Math.pow(2, numMax)
            }
            numMax = numMax - 1
            numSoma = numSoma + parse_rate
        }
        parse_rate = numSoma
        /* ********************************************************************************************* */
        var parse_speed = 0
        numMax = payload_Speed.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Speed.length; i++) {
            parse_speed = Number(payload_Speed.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_speed
        }
        parse_speed = numSoma / 10
        /* ********************************************************************************************* */
        var parse_position = 0
        numMax = payload_Position.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Position.length; i++) {
            parse_position = Number(payload_Position.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_position
        }
        parse_position = numSoma
        /* ********************************************************************************************* */
        var parse_lon = 0
        numMax = payload_Lon.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Lon.length; i++) {
            if (i === 0) {
                parse_lon = Number(payload_Lon.charAt(i)) * Math.pow(2, numMax) * -1
            } else {
                parse_lon = Number(payload_Lon.charAt(i)) * Math.pow(2, numMax)
            }
            numMax = numMax - 1
            numSoma = numSoma + parse_lon
        }
        myInt = 0
        myDec = 0.00000000000
        myDec60 = 0.00000000000
        latitude = 0.00000000000
        payload_Lon = numSoma / 10000
        payload_Lon = payload_Lon / 60
        longitude = payload_Lon
        myInt = parseInt(payload_Lon)
        myDec = payload_Lon - myInt
        myDec60 = myDec * 60
        parse_lon = myInt + "°" + myDec60 + "´"

        /* ********************************************************************************************* */
        var parse_lat = 0
        numMax = payload_Lat.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Lat.length; i++) {
            if (i === 0) {
                parse_lat = Number(payload_Lat.charAt(i)) * Math.pow(2, numMax) * -1
            } else {
                parse_lat = Number(payload_Lat.charAt(i)) * Math.pow(2, numMax)
            }
            numMax = numMax - 1
            numSoma = numSoma + parse_lat
        }
        myInt = 0
        myDec = 0.00000000000
        myDec60 = 0.00000000000
        latitude = 0.00000000000
        payload_Lat = numSoma / 10000
        payload_Lat = payload_Lat / 60

        latitude = payload_Lat
        myInt = parseInt(payload_Lat)
        myDec = payload_Lat - myInt
        myDec60 = myDec * 60
        parse_lat = myInt + "°" + myDec60 + "”"
        /* ********************************************************************************************* */
        var parse_course = 0
        numMax = payload_Course.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Course.length; i++) {
            parse_course = Number(payload_Course.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_course
        }
        /* parse_course = numSoma / 10 + "°" */
        parse_course = numSoma / 10

        /* ********************************************************************************************* */
        var parse_heading = 0
        numMax = payload_Heading.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Heading.length; i++) {
            parse_heading = Number(payload_Heading.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_heading
        }
        parse_heading = numSoma
        /* ********************************************************************************************* */
        var parse_maneuer = 0
        numMax = payload_Maneuer.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Maneuer.length; i++) {
            parse_maneuer = Number(payload_Maneuer.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_maneuer
        }
        parse_maneuer = numSoma
        /* ********************************************************************************************* */
        var parse_raim = 0
        numMax = payload_Raim.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Raim.length; i++) {
            parse_raim = Number(payload_Raim.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_raim
        }
        parse_raim = numSoma
        /* ********************************************************************************************* */
        var parse_radio = 0
        numMax = payload_Radio.length - 1
        numSoma = 0
        for (var i = 0; i < payload_Radio.length; i++) {
            parse_radio = Number(payload_Radio.charAt(i)) * Math.pow(2, numMax)
            numMax = numMax - 1
            numSoma = numSoma + parse_radio
        }
        parse_radio = numSoma
        /* ********************************************************************************************* */



        const data = {
            id_origem: req.body.id,
            raw: req.body.raw,
            packet_type: type,
            channel: Radio_channel,
            type: parse_type,
            repeat: parse_repeat,
            mmsi: parse_mmsi,
            status: parse_status,
            rate: parse_rate,
            speed: parse_speed,
            position: parse_position,
            lon: parse_lon,
            longitude: longitude,
            lat: parse_lat,
            latitude: latitude,
            course: parse_course,
            heading: parse_heading,
            maneuer: parse_maneuer,
            raim: parse_raim,
            radio: parse_radio,
            timestamp: new_time
        }

        const newRaw = new decoder({
            id_origem: myIdReceived,
            new_raw,
            type,
            channel: Radio_channel,
            message_type: parse_type,
            repeat: parse_repeat,
            mmsi: parse_mmsi,
            status: parse_status,
            rate: parse_rate,
            speed: parse_speed,
            position: parse_position,
            lon: parse_lon,
            longitude,
            lat: parse_lat,
            latitude,
            course: parse_course,
            heading: parse_heading,
            maneuer: parse_maneuer,
            raim: parse_raim,
            radio: parse_radio,
            timestamp: new_time
        });


        await newRaw.save()
            .then(() => {
                res.status(200).json({
                    success: true,
                    msg: "Message Decoded!",
                    content: newRaw,
                })
            })
            .catch((error) => {
                res.status(400).json({
                    success: false,
                    msg: "Message NOT Decoded!",
                    content: error
                })
            })
    })




}