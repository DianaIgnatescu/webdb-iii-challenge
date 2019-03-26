
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('cohorts').insert([
        {name: 'WebEU1'},
        {name: 'WebEU2'},
        {name: 'WebEU3'}
      ]);
    });
};
