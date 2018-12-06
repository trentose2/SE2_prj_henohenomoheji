const mdb = require('./../../mdb/mdb');
const result400 = {status: 400, body: {code: 400, message: "Bad Request"}};
const result401 = {status: 401, body: {code: 401, message: "Unauthorized, missing or invalid API Key"}};
const result404 = {status: 404, body: {code: 404, message: "Not Found"}};


/**
 *  controlla se selection contiene valore giusto
 * @param {type} selection
 * @returns {int} se è valido ritorna 1 (created) o 2 (assingned), altrimenti 0
 */
function isValidselection(selection) {
        let valid = 0;
        if (selection === "created")
        {
                valid = 1;
        }
        if (selection === "assigned")
        {
                valid = 2;
        }
        return valid;
}

/**
 * controlla se input di post e put sia valido
 * @param {type} body
 * @returns {isEmptyOnPostInput.empty|Boolean}
 */
function isValidInput(body) {
        let valid = true;

        //controlla i dati sia definito e non sia vuoto
        if (body.title === undefined || body.title === "" || body.description === undefined || body.description === "" || body.tasks_ids === undefined || body.group_id === undefined || body.final_deadline === undefined || body.final_deadline === "" || body.review_deadline === undefined || body.review_deadline === "")
        {
                valid = false;
        }
        //controlla se le date sono valide e final_deadline è almeno un giorno prima di review_deadline
        else if (isNaN(Date.parse(body.final_deadline)) || isNaN(Date.parse(body.review_deadline)) || (Date.parse(body.final_deadline) + 86400000) > Date.parse(body.review_deadline))
        {
                valid = false;
        }

        return valid;

}


/**
 * formattare la data per essere sicuro di avere formato giusto
 * @param {type} date
 * @returns {formatDate.formattedDate|String}
 */
function formatDate(date) {

        let milliseconds = Date.parse(date);
        let data = new Date();
        data.setTime(milliseconds);
        let formattedDate = data.getFullYear() + "-" + (data.getMonth() + 1) + "-" + data.getDate();
        return formattedDate;
}


/**
 * get exam list
 * if user is teacher return all exam created by him
 * if user is student return all his assigned  exam
 * @param {type} token
 * @param {type} selection
 * @returns {getExamlist.result|nm$_exam_submission.getExamlist.result|nm$_exam_submission.result400|nm$_exam_submission.result401}
 */
function getExamlist(token, selection) {
        console.log("TOKEN : " + token + ", SELECTION : " + selection);
        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //if isn't valid selection value
        else if (isValidselection(selection) === 0)
        {
                console.log("SELECTION IS NOT VALID");
                result = result400;
        }
        else
        {
                console.log("SELECTION IS VALID");
                let body;
                if (isValidselection(selection) === 1)
                {
                        body = mdb.exams.filterByOwner(user);
                }
                else if (isValidselection(selection) === 2)
                {
                        body = mdb.exams.filterByAssingned(user); //...........................................
                }
                console.log("FOUND");
                console.log(body);
                //se body è un array vuoto, significa 404
                if (body.length === 0)
                {
                        result = result404;
                }
                else
                {
                        result = {};
                        result.status = 200;
                        result.body = body;
                }

        }

        return result;
}

/**
 * crea nuovo exam attraverso post
 * @param {type} token
 * @param {type} postBody
 * @returns {nm$_exams.result400|nm$_exams.postExam.result|postExam.result|nm$_exams.result401}
 */
function postExam(token, postBody) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //check validità di input
        else if (!isValidInput(postBody))
        {
                result = result400;
        }
        else
        {

                //get parametri
                let title = postBody.title;
                let description = postBody.description;
                //get array di taskInExam
                let tasks_ids = postBody.tasks_ids;
                let taskset = [];
                //se tasks_ids non è vuoto
                if (tasks_ids !== "")
                {
                        //se tasks_ids non è un array, trasforma in array
                        if (tasks_ids.length === undefined)
                        {
                                tasks_ids = [tasks_ids];
                        }
                        for (let i = 0; i < tasks_ids.length; i++)
                        {
                                let singleTask = mdb.tasks.getTaskById(parseInt(tasks_ids[i]));
                                if (singleTask !== undefined)
                                {
                                        taskset.push({"task_id": singleTask.id, "description": singleTask.description});
                                }

                        }
                }
                //get gruppo
                let group_id = postBody.group_id;
                let group = "";
                // se gruppo non è vuoto
                if (group_id !== "")
                {
                        group = mdb.groups.getGroupById(parseInt(group_id));
                }
                //get data con formatta giusta
                let final_deadline = formatDate(postBody.final_deadline);
                let review_deadline = formatDate(postBody.review_deadline);

                //insesce nella tabella
                let body = mdb.exams.add({id: user.id, email: user.email}, title, description, taskset, group, final_deadline, review_deadline);

                result = {};
                result.status = 201;
                result.body = body;
        }


        return result;
}

/**
 * get a single exam
 * @param {type} token
 * @param {type} exam_id
 * @returns {nm$_exams.result400|nm$_exams.getExam.result|nm$_exams.result401|nm$_exams.result404|getExam.result}
 */
function getExam(token, exam_id) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //if isn't valid id
        else if (exam_id === undefined || isNaN(parseInt(exam_id)))
        {

                result = result400;
        }
        else
        {

                let body = mdb.exams.getExamById(parseInt(exam_id));
                //se body è un oggetto vuoto, significa 404
                if (body === undefined)
                {
                        result = result404;
                }
                else
                {
                        result = {};
                        result.status = 200;
                        result.body = body;
                }

        }

        return result;
}

/**
 * update un esame già esistente
 * @param {type} token
 * @param {type} putBody
 * @param {type} exam_id
 * @returns {nm$_exams.putExam.result|nm$_exams.result401|putExam.result}
 */
function putExam(token, putBody, exam_id) {

        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //if isn't valid id
        else if (exam_id === undefined || isNaN(parseInt(exam_id)))
        {

                result = result400;
        }

        //check validità di input
        else if (!isValidInput(putBody))
        {
                result = result400;
        }

        else
        {

                let exam = mdb.exams.getExamById(parseInt(exam_id));
                //se non esiste esame con tale id
                if (exam === undefined)
                {

                        result = result404;
                }
                else
                {

                        //get parametri
                        let title = putBody.title;
                        let description = putBody.description;
                        //get array di taskInExam
                        let tasks_ids = putBody.tasks_ids;
                        let taskset = [];
                        //se tasks_ids non è vuoto
                        if (tasks_ids !== "")
                        {
                                //se tasks_ids non è un array, trasforma in array
                                if (tasks_ids.length === undefined)
                                {
                                        tasks_ids = [tasks_ids];
                                }
                                for (let i = 0; i < tasks_ids.length; i++)
                                {
                                        let singleTask = mdb.tasks.getTaskById(parseInt(tasks_ids[i]));
                                        if (singleTask !== undefined)
                                        {
                                                taskset.push({"task_id": singleTask.id, "description": singleTask.description});
                                        }

                                }
                        }
                        //get gruppo
                        let group_id = putBody.group_id;
                        let group = "";
                        //se group non è vuoto
                        if (group_id !== "")
                        {
                                group = mdb.groups.getGroupById(parseInt(group_id));
                        }
                        //get data con formatta giusta
                        let final_deadline = formatDate(putBody.final_deadline);
                        let review_deadline = formatDate(putBody.review_deadline);

                        //insesce nella tabella
                        let index = mdb.exams.getIndexById(parseInt(exam_id));
                        mdb.exams[index].update(title, description, taskset, group, final_deadline, review_deadline);

                        result = {};
                        result.status = 200;
                }
        }
        return result;
}


function getSubmissionsOfExam(token, exam_id) {


        //il risultato da ritornare
        let result;
        //get user
        let user = mdb.active_users.getUserByToken(token);
        //if isn't empty
        if (user === null)
        {
                result = result401;
        }
        //if isn't valid id
        else if (exam_id === undefined || isNaN(parseInt(exam_id)))
        {

                result = result400;
        }


        else
        {
                let exam = mdb.exams.getExamById(parseInt(exam_id));
                //se non esiste esame con tale id
                if (exam === undefined)
                {

                        result = result404;
                }
                else
                {

                        let body;

                        body = mdb.exam_submissions.filterByExam(exam);

                        //se body è un array vuoto, significa 404
                        if (body.length === 0)
                        {
                                result = result404;
                        }
                        else
                        {
                                result = {};
                                result.status = 200;
                                result.body = body;
                        }

                }
        }

        return result;



}

module.exports.result400 = result400;
module.exports.result401 = result401;
module.exports.result404 = result404;
module.exports.getExamlist = getExamlist;
module.exports.postExam = postExam;
module.exports.getExam = getExam;
module.exports.putExam = putExam;
module.exports.getSubmissionsOfExam = getSubmissionsOfExam;