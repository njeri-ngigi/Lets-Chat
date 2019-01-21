const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./src/app/routes');

const server = express();
const port = 8000;

server.use(logger('dev'));

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.set('view engine', 'ejs');

routes(server);
server.get('*', (req, res) => res.status(200).send({
  message: 'Welcome to the beginning of nothingness',
}));

server.listen(port, () => console.log(`Live on port ${port}`));
