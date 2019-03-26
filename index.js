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

server.get('/api/cohorts', (req, res) => {
  db('cohorts')
      .then((cohorts) => {
        res.status(200).json(cohorts);
      })
      .catch((error) => {
        res.status(500).json({ errorMessage: 'The cohorts could not be retrieved.' });
      })
});

server.get('/api/cohorts/:id', (req, res) => {
  const {id} = req.params;
  db('cohorts')
      .where({ id: id })
      .then((cohort) => {
        if(!cohort) {
          res.status(404).json({ message: 'The cohort with the specified ID does not exist.' });
        } else {
          res.status(200).json(cohort)
        }
      })
      .catch((error) => {
        res.status(500).json({ error: 'The cohort information could not be retrieved.' });
      });
});
