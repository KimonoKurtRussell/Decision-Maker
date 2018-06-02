exports.up = function(knex, Promise) {
  return knex.schema.dropTableIfExists('option')
    .dropTableIfExists('poll')
.dropTableIfExists('users')
    .then(createUserTable)
    .then(createPollTable)
    .then(createOptionTable)
    .then(createDummyData);

  function createUserTable() {
    return knex.schema.createTable('users', table => {
      table.increments('id').primary()
      table.string('email').unique().notNullable().comment('email is a must')
      table.string('name')
    })
  };

function createPollTable() {
    return knex.schema.createTable('poll', table => {
      table.increments('poll_id').primary()
      table.string('admin_url')
      table.string('poll_url')
      table.string('poll_question')
      table.string('question_description')
      table.integer('user_id_fk').unsigned()
      table.foreign('user_id_fk').references('id').inTable('users');
    })
  };
  // function createPollTable() {
  //   return knex.schema.createTable('poll', table => {
  //     table.increments('poll_id').primary()
  //     table.string('admin_url').unique().comment('admin url')
  //     table.string('poll_url').unique().comment('poll url')
  //     table.string('poll_question')
  //     table.string('question_description')
  //     table.integer('user_id_fk').unsigned()
  //     table.foreign('user_id_fk').references('id').inTable('users');
  //   })
  // };

  function createOptionTable() {
    return knex.schema.createTable('option', table => {
      table.increments('option_id').primary()
      table.string('choice_description')
      table.integer('score')
      table.integer('poll_id_fk').unsigned()
      table.foreign('poll_id_fk').references('poll_id').inTable('poll');
    })
  };

  function createDummyData() {
    return Promise.all([knex('users').insert([
      {email: "DooDoo@CuCu.ca", name: "DooDoo"},
      {email: "BooBoo@gmail.com", name: "BooBoo"}]),
      knex('poll').insert([
      {admin_url: "admin/xyz", poll_url: "/xyz",
      poll_question: "do you like PooPoo?", user_id_fk: 1}]),
      knex('option').insert([
      {choice_description: "Yes", score: "0", poll_id_fk: 1},
      {choice_description: "No", score: "1", poll_id_fk: 1},
      {choice_description: "Maybe", score: "2", poll_id_fk: 1}])
      ])
};
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTableIfExists('option')
    .dropTableIfExists('poll')
.dropTable('users')
};
