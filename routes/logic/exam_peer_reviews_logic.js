const mdb = require ('./../../mdb/mdb');
const errors = require('./../../schemas/errors/generic.json');
const Ajv = require('ajv');
var ajv = new Ajv();

function insert_exam_peer_review(token, exam_review){
    var now = new Date();
	var scheck = ajv.validate(require('./../../schemas/payloads/exam_peer_review_post.json'), exam_review);
	if(scheck){//se il payload ha un formato valido
		var user = mdb.active_users.getUserByToken(token);
		if(user !== null){//se l'utente loggato esiste
			var ref_sub = mdb.exam_submissions.getExamSubmissionById(exam_review.ref_submission);
			if(ref_sub !== undefined){//se esiste la submission
				console.log("NOW ->" + now);
				console.log("DEADLINE -> " + ref_sub.ref_exam.review_deadline);
				if(now < ref_sub.ref_exam.review_deadline){//se è entro la data limite
                    console.log("VALID DEADLINE");
                    var idx = mdb.exam_peer_reviews.getIndexByUserAndSubmission(user, ref_sub);
					if(idx >= 0){//se è stato assegnato come reviewer
						if(mdb.exam_peer_reviews[idx].review === ""){//se non ha già submittato una review
							console.log("HE HASN'T SUBMITTED YET");
							var review = mdb.exam_peer_reviews[idx].update("", "", exam_review.review);
							return {"status": 201, "body": review};
						}else{//there's already a review
							return errors.error400;
						}
					}else{//the user is not the reviewer
						return errors.error401;
					}
				}else{//the deadline expired
					return errors.error400;
				}
			}else{//the submission does not exist
				return errors.error400;
			}
		}else{//the token is not correct
			return errors.error401;
		}
	}else{//the payload doesn't respect the schema
		return errors.error400;
	}
}

module.exports.insert_exam_peer_review = insert_exam_peer_review;