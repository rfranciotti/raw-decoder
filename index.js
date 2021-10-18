const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors') /* localhost to atlas - Same-Origin Policy em diferentes portas*/
const api = require('./config/custom-express')
const colors = require('colors')
const CFonts = require('cfonts');
const errorHandler = require('./middleware/erros')




/************************** */
/* Variaveis de ambiente */
require('dotenv').config();
const port = process.env.PORT || 5000
const db = process.env.MongoDBName
const environment = process.env.NODE_ENV
const url = process.env.MONGODB_URI
const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}
/************************** */


/************************** */
/* CORS ******************* */
var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

api.use(cors(corsOptions))
api.use(errorHandler)
/************************** */



/************************** */
/* INICIALIZANDO O EXPRESS */

api.listen(port, () => {
    console.log(`API is running at port: ${port.underline}`.green)
})

//console.clear();

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection
    .once("open", () => {
        console.log(("Conectou com AtlasDB" + " - Database :" + db.bgMagenta.underline).white)
        console.log("--------------------------------------------------".rainbow)
        console.log("")

        if (environment === "production") {
            CFonts.say('decoder|IS |ready!', {
                font: 'chrome',              // define the font face
                align: 'left',              // define text alignment
                colors: ['red'],         // define all colors
                background: 'black',  // define the background color, you can also use `backgroundColor` here as key
                letterSpacing: 1,           // define letter spacing
                lineHeight: 1,              // define the line height
                space: false,                // define if the output text should have empty lines on top and on the bottom
                maxLength: '10',             // define how many character can be on one line
                gradient: true,            // define your two gradient colors
                independentGradient: true, // define if you want to recalculate the gradient for each new line
                transitionGradient: true,  // define if this is a transition between colors directly
                env: 'node'                 // define the environment CFonts is being executed in
            });
        } else {
            CFonts.say('decoder|IS |ready!', {
                font: 'chrome',              // define the font face
                align: 'left',              // define text alignment
                colors: ['yellow'],         // define all colors
                background: 'black',  // define the background color, you can also use `backgroundColor` here as key
                letterSpacing: 1,           // define letter spacing
                lineHeight: 1,              // define the line height
                space: false,                // define if the output text should have empty lines on top and on the bottom
                maxLength: '10',             // define how many character can be on one line
                gradient: false,            // define your two gradient colors
                independentGradient: true, // define if you want to recalculate the gradient for each new line
                transitionGradient: true,  // define if this is a transition between colors directly
                env: 'node'                 // define the environment CFonts is being executed in
            });
        }




    })
    .on("error", (error) => {
        console.warn("Erro de conexão!".trap, error)
    })






// const prettyFont = CFonts.render('Hello|world!', {/* same settings object as above */ });

// console.log(prettyFont.string);  // the ansi string for sexy console font
// console.log(prettyFont.array)   // returns the array for the output
// console.log(prettyFont.lines)   // returns the lines used
// console.log(prettyFont.options) // returns the options used


/************************** */


var mostraColors = false

if (mostraColors) {
    console.log("TEXTO 1 exemplo de Colors".black);
    console.log("TEXTO 2 exemplo de Colors".red);
    console.log("TEXTO 3 exemplo de Colors".green);
    console.log("TEXTO 4 exemplo de Colors".yellow);
    console.log("TEXTO 5 exemplo de Colors".blue);
    console.log("TEXTO 6 exemplo de Colors".magenta);
    console.log("TEXTO 7 exemplo de Colors".cyan);
    console.log("TEXTO 8 exemplo de Colors".white);
    console.log("TEXTO 9 exemplo de Colors".gray);
    console.log("TEXTO 10 exemplo de Colors".grey);

    console.log("TEXTO 1 exemplo de BrightColors".brightRed);
    console.log("TEXTO 2 exemplo de BrightColors".brightGreen);
    console.log("TEXTO 3 exemplo de BrightColors".brightYellow);
    console.log("TEXTO 4 exemplo de BrightColors".brightBlue);
    console.log("TEXTO 5 exemplo de BrightColors".brightMagenta);
    console.log("TEXTO 6 exemplo de BrightColors".brightCyan);
    console.log("TEXTO 7 exemplo de BrightColors".brightWhite);


    console.log("TEXTO 1 exemplo de background colors".bgBlack);
    console.log("TEXTO 1 exemplo de background colors".bgRed);
    console.log("TEXTO 1 exemplo de background colors".bgGreen);
    console.log("TEXTO 1 exemplo de background colors".bgYellow);
    console.log("TEXTO 1 exemplo de background colors".bgBlue);
    console.log("TEXTO 1 exemplo de background colors".bgMagenta);
    console.log("TEXTO 1 exemplo de background colors".bgCyan);
    console.log("TEXTO 1 exemplo de background colors".bgWhite);
    console.log("TEXTO 1 exemplo de background colors".bgGray);
    console.log("TEXTO 1 exemplo de background colors".bgGrey);

    console.log("TEXTO 1 exemplo de bright background colors".bgBrightRed);
    console.log("TEXTO 1 exemplo de bright background colors".bgBrightGreen);
    console.log("TEXTO 1 exemplo de bright background colors".bgBrightYellow);
    console.log("TEXTO 1 exemplo de bright background colors".bgBrightBlue);
    console.log("TEXTO 1 exemplo de bright background colors".bgBrightMagenta);
    console.log("TEXTO 1 exemplo de bright background colors".bgBrightCyan);
    console.log("TEXTO 1 exemplo de bright background colors".bgBrightWhite);



    console.log("TEXTO 1 exemplo de styles".reset);
    console.log("TEXTO 1 exemplo de styles".bold);
    console.log("TEXTO 1 exemplo de styles".dim);
    console.log("TEXTO 1 exemplo de styles".italic);
    console.log("TEXTO 1 exemplo de styles".underline);
    console.log("TEXTO 1 exemplo de styles".inverse);
    console.log("TEXTO 1 exemplo de styles".hidden);
    console.log("TEXTO 1 exemplo de styles".strikethrough);


    console.log("TEXTO 1 exemplo extras".rainbow);
    console.log("TEXTO 1 exemplo extras".zebra);
    console.log("TEXTO 1 exemplo extras".america);
    console.log("TEXTO 1 exemplo extras".trap);
    console.log("TEXTO 1 exemplo extras".random);




    console.log("ARGV".yellow, (process.argv))











}

