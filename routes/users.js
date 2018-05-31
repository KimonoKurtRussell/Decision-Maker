"use strict";

const express = require('express');
const router = express.Router();
var app = express();

module.exports = (knex) => {

	router.get("/", (req, res) => {
		knex
			.select("*")
			.from("users")
			.then((results) => {
				res.json(results);
			});
	});


	router.post('/api/users', (req, res) => {
		let insertuser = {
			name: req.body.name,
			email: req.body.email
		};
		let insertpoll = {
			poll_question: req.body.question,
			//			user_id: req:b
		};
		let insertoption = {
			choice_description: req.body.op1
		};
		let insertoption2 = {
			choice_description: req.body.op2
		};

		// console.log(req.body, "users.js");
		// if (!req.body.text) {
		// 	res.status(400).json({
		// 		error: 'invalid request: no data in POST body'
		// 	});
		// 	return;
		// }

		knex
			.insert(insertuser).into('users').returning('id')
			//	.('poll').insert('req.body.question')
			.then(response =>
				knex.insert({
					poll_question: req.body.question,
					user_id_fk: response[0]
				}).into('poll').returning('poll_id'))
			//		.insert(insertpoll).into('poll').select('req.body.question', id).from('users')
			.then(function(response) {
				return knex('option')
					.insert([{
						choice_description: req.body.op1,
						poll_id_fk: response[0]
					}, {
						choice_description: req.body.op2,
						poll_id_fk: response[0]
					}])
			})
			// .then(function(response) {
			// 	return knex('option')
			// 		.insert({
			// 			choice_description: req.body.op2,
			// 			poll_id: response[0]
			// 		})
			// })

		//			from("pollToSelectDataFrom")).into("users")

		// .insert(insertpoll).into('poll').select('req.body.question', id).from('users')
		// 	.where('name').equals(req.body.name);
		// .insert(insertoption).into('option')
		// .insert(insertoption2).into('option')
		// res.redirect('/poll');

	});
	return router;
}