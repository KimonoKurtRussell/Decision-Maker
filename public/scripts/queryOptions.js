// module.exports = function(knex) {
//   function findPollData(adminURL, cb) {
//     knex("option")
//     .select("poll_question", "choice_description", "score")
//       .join("poll", "poll_id_fk", "=", "poll_id")
//       .where("admin_url", adminURL)
//       .then(rows =>
//         cb(null, rows)
//       )
//       .catch(err => cb(err))
//   }
//   return {
//     findPollData
//   };
// };


module.exports = function(knex) {
  function findPollData(pollURL, cb) {
    knex("option")
    .select("poll_question", "choice_description", "score")
      .join("poll", "poll_id_fk", "=", "poll_id")
      .where("poll_url", pollURL)
      .then(rows =>
        cb(null, rows)
      )
      .catch(err => cb(err))
  }
  return {
    findPollData
  };
};
