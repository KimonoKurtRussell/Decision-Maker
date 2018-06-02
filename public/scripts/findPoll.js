module.exports = function(knex) {
  function findPollDis(pollURL, cb) {
    knex('option')
    .select("poll_question", "choice_description")
      .join("poll", "poll_id_fk", "=", "poll_id")
      .where("poll_url", pollURL)
      .then(rows =>
        cb(null, rows)
      )
      .catch(err => cb(err))
  }
  return {
    findPollDis
  };
};




// module.exports = function(knex) {
//   function findPollDis(pollURL, cb) {
//     knex('poll')
//       .join("option", "option_id", "=", "poll_id")
//       .where("poll_url", pollURL)
//       .then(rows =>
//         cb(null, rows)
//       )
//       .catch(err => cb(err))
//   }
//   return {
//     findPollDis
//   };
// };

// module.exports = function(knex) {
//   function findPollDis(pollURL, cb) {
//     knex('option')
//       .join("poll", "poll_id_fk", "=", "poll_id")
//       .where("poll_url", pollURL)
//       .then(rows =>
//         cb(null, rows)
//       )
//       .catch(err => cb(err))
//   }
//   return {
//     findPollDis
//   };
// };




// module.exports = function(knex) {
//   function findPollDis(pollURL, cb) {
//     knex('poll')
//       .where("poll_url", pollURL)
//       .then(rows =>
//         cb(null, rows)
//       )
//       .catch(err => cb(err))
//   }
//   return {
//     findPollDis
//   };
// };
