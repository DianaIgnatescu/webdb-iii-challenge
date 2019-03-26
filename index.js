const express = require('express');
const knex = require('knex');
const knexConfig = require('./knexfile');

const db = knex(knexConfig.development);

const server = express();

server.use(express.json());

server.post('/api/cohorts', (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ errorMessage: 'Please provide a name for the cohort.' });
  } else {
    db('cohorts').insert({ name })
        .then(arrayOfIds => {
          return db('cohorts').where({ id: arrayOfIds[0] })
        })
        .then(arrayOfCohorts => {
          res.status(201).json(arrayOfCohorts[0]);
        })
        .catch(error => {
          res.status(500).json({ errorMessage: 'The cohort could not be created. '});
        });
  }
});
