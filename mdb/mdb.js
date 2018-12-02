var Users = require('./classes/User'); var Tasks = require('./classes/Task');
var Groups = require('./classes/Group'); var Exams = require('./classes/Exam');
var Exam_Submissions = require('./classes/Exam_Submission');
var Exam_Peer_Reviews = require('./classes/Exam_Peer_Review');
var Active_Users = require('./classes/Active_Users');
var users = new Users(); var tasks = new Tasks(); var groups = new Groups();
var exams = new Exams(); var exam_submissions = new Exam_Submissions();
var exam_peer_reviews = new Exam_Peer_Reviews(); var active_users = new Active_Users();
//------------------------------------------


//default users | input schema: (name, surname, email, password, type)
users.add("gano", "gano", "gino@gino", "pwd1");users.add("geno", "genovese", "geno@geno", "pwd2");
users.add("gino", "gino", "gano@gsno", "pwd3");users.add("gono", "gonovese", "guno@geno", "pwd4");
users.add("guno", "guno", "gono@gono", "pwd5");
//console.log("\x1b[36mUSERS _> \x1b[0m");//console.log("," + users);//console.log("\n###################\n");

//default tasks | input schema: (owner, task_type, subject, description, description, answer[], solution)
tasks.add({"id": users[0].id, "email": users[0].email}, "multiple choice", "CS", "title1", "my top desc 1", ["opt1", "opt2", "opt3"], "opt3");
tasks.add({"id": users[0].id, "email": users[0].email}, "multiple choice", "CS", "title2", "my top desc 2", ["opt1", "opt2", "opt3"], "opt1");
tasks.add({"id": users[0].id, "email": users[0].email}, "text", "CS", "title3", "my top desc 3", undefined, "correct solution");
//console.log("\x1b[34mTASKS _> \x1b[0m");//console.log("," + tasks);//console.log("\n###################\n");

//default groups | input schema: (owner, name, description, members[])
groups.add({"id": users[0].id, "email": users[0].email}, "group1", "desch1", [{"id": users[1].id, "email": users[1].email}, {"id": users[2].id, "email": users[2].email}, {"id": users[3].id, "email": users[3].email}, {"id": users[4].id, "email": users[4].email}]);
groups.add({"id": users[1].id, "email": users[1].email}, "group2", "desc2", [{"id": users[1].id, "email": users[1].email}, {"id": users[2].id, "email": users[2].email}, {"id": users[3].id, "email": users[3].email}]);
//console.log("\x1b[32mGROUPS _> \x1b[0m");//console.log("," + groups);//console.log("\n###################\n");

//default exams | input schema: (owner, title, subject, description, taskset[], final_deadline, review_deadline)
exams.add({"id": users[0].id, "email": users[0].email}, "cool title", "description", [{"id":tasks[0].id, "text": tasks[0].description}, {"id":tasks[2].id, "text": tasks[2].description}], groups[0], new Date("2018-12-31"), new Date("2019-02-01"));
//console.log("\x1b[31mEXAMS _> \x1b[0m");//console.log("" + exams);//console.log("\n###################\n");

//default exam_submissions | input schema: (ref_exam, submitter, answer[], status)
exam_submissions.add(exams[0], {"id": users[1].id, "email": users[1].email}, ["opt3", "opt2"], "on hold");
//console.log("EXAM_SUBMISSIONS _>");//console.log(exam_submissions);//console.log("\n###################\n");

//default exam_peer_reviews | input schema: (group_member_of_exam, exam_submission, review[])
exam_peer_reviews.add({"id": users[3].id, "email": users[3].email}, exam_submissions[0], "");
//console.log("EXAM_PEER_REVIEWS _>");//console.log(exam_peer_reviews);//console.log("\n###################\n");
//login.get(/login)
    active_users.add({"id": users[0].id, "email": users[0].email});active_users.add({"id": users[1].id, "email": users[1].email});
    active_users.add({"id": users[2].id, "email": users[2].email}); active_users.add({"id": users[3].id, "email": users[3].email});
    console.log("token[0](GANO is an exam owner) is " + active_users[0].token);
    console.log("token[1](GENO is an exam submitter) is " + active_users[1].token);
    console.log("token[2](GINO) is " + active_users[2].token);
    console.log("token[3](GONO) is " + active_users[3].token);
//console.log("ACTIVE_USERS _>");//console.log(active_users);//console.log("\n###################\n");
//console.log(exams);
console.log(exams[0].final_deadline<exams[0].review_deadline);
console.log(exams[0].final_deadline<new Date());
//------------------------------------------
module.exports.users = users; module.exports.tasks = tasks; module.exports.groups = groups;
module.exports.exams = exams; module.exports.exam_submissions = exam_submissions;
module.exports.exam_peer_reviews = exam_peer_reviews; module.exports.active_users = active_users;
