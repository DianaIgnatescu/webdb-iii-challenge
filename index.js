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

server.get('/api/cohorts/:id/students', (req, res) => {
  const { id } = req.params;
  db('students')
      .join('cohorts', { 'students.cohort_id': 'cohorts.id' })
      .select('students.id', 'students.name', 'cohorts.name as cohort')
      .where({ cohort_id: id})
      .then((students) => {
        res.status(200).json({ students});
      })
      .catch((error) => {
        res.status(500).json({ errorMessage: 'The students from the specified cohort could not be retrieved.' })
      })
})

server.put('/api/cohorts/:id', (req, res) => {
  const { id } = req.params;
  const cohort = req.body;
  if (!cohort) {
    res.status(400).json({ errorMessage: 'Please provide a name for the cohort.' });
  } else {
    db('cohorts')
        .where({ id: id })
        .update(cohort)
        .then(() => {
          return db('cohorts').where({id: id }).first();
        })
        .then( record => res.status(200).json(record))
        .catch(error => {
          res.status(500).json({ errorMessage: 'The cohort information could not be modified.' })
        });
  }
});

server.delete('/api/cohorts/:id', (req, res) => {
  const { id } = req.params;
  db('cohorts')
      .where({ id: id })
      .del()
      .then(count => {
        res.status(200).json({ message: `${count} item removed from the database.` });
      })
      .catch((error) => {
        res.status(500).json({ error: "The cohort record could not be deleted." });
      });
});

const port = 5000;
server.listen(port, () => console.log(`Listening on http://localhost:${port}`));
