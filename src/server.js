const express = require('express');
const app_express = express();
const pages = require('./pages.js')
const path = require('path')

app_express
    .use(express.static('public'))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', pages.index)
    .get('/splash_screen', pages.splash_screen)

module.exports = app_express;