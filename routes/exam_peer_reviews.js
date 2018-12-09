const express = require('express');
const router = express.Router();
const logic = require('./logic/exam_peer_reviews_logic');
const genericErrors = require('./../schemas/errors/generic');
const reviewsErrors = require('./../schemas/errors/review');


router.get('/', function(req, res) {
	let type = req.query.select;
	let token = req.query.token;
	var result = logic.display_exam_peer_reviews_list(token, type);
	res.status(result.status);
	res.json(result.body);
});

router.get('/:id', function (req, res) {
	let id= req.params.id;
	let token = req.query.token;
	var result = logic.getPeerReviewById(token, id);
	res.status(result.status);
	res.json(result.body);
});

router.put('/:id', function(req, res) {
	let id = req.params.id;
	let token = req.query.token;
	//Just a string of the new review
	let updatedReview = req.body;
	let result = logic.routerUpdateReview(token, id, updatedReview);
	res.send(result);
});

router.post('/', function(req, res){
	var result = logic.insert_exam_peer_review(req.query.token, req.body);
	res.status(result.status);
	res.json(result.body);
});

module.exports.router = router;
