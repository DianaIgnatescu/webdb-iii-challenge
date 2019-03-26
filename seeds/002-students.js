
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('students')
    .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('students').insert([
        {cohort_id: 1, name: 'Lambda Student1'},
        {cohort_id: 2, name: 'Lambda Student2'},
        {cohort_id: 3, name: 'Lambda Student3'}
      ]);
    });
};
