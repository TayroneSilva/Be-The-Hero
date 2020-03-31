const express = require('express');

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController')

const routes = express.Router();

routes.post('/sessions', SessionController.create);

// rotas de listagem e criação de ongs
routes.get('/ongs', OngController.index);
routes.post('/ongs', OngController.create);

// Rota de Listagem de todos os casos de uma Ong
routes.get('/profile', ProfileController.index);

//Rotas de Criação, Listagem, e Exclusão de um Caso específico de uma ong
routes.get('/incidents', IncidentController.index);
routes.post('/incidents', IncidentController.create);
routes.delete('/incidents/:id',IncidentController.delete);

module.exports = routes;