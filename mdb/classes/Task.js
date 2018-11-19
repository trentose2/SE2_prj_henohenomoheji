class Task{
    /* 
    id(integer) PRIMARY KEY
    owner(User) FOREIGN KEY
    task_type(string)
    subject(string)
    title(string)
    description(string)
    answer(string[]) DEFAULT NULL
    solutions(string[]) 
    */
    constructor(id, owner, task_type, subject, title, description, answer, solutions){
        this.id = id; this.owner = owner; this.task_type = task_type; this.subject = subject; 
        this.title = title; this.description = description; this.answer = answer; this.solutions = solutions;
    }
    update(task_type, subject, title, description, answer, solutions){
        (task_type !== "" || task_type !== undefined) ? this.task_type = task_type : console.log("T_T");
        (subject !== "" || subject !== undefined) ? this.subject = subject : console.log("T_T"); 
        (title !== "" || title !== undefined) ? this.title = title : console.log("T_T"); 
        (description !== "" || description !== undefined) ? this.description = description : console.log("T_T");
        (answer !== "" || answer !== undefined) ? this.answer = answer : console.log("T_T"); 
        (solutions !== "" || solutions !== undefined) ? this.solutions = solutions : console.log("T_T"); 
    }
    toString(){
        return "\x1b[34mID : " + this.id + "\x1b[0m\nOWNER -> " + this.owner + "TASK TYPE : " + this.task_type +
               ", SUBJECT : " + this.subject + ", TITLE : " + this.title + ", DESCRIPTION : " + this.description +
               ", ANSWERS : " + this.answer + ", SOLUTIONS : " + this.solutions + "\n";
    }
}
class Tasks extends Array{
    //ADD METHOD
    add(owner, task_type, subject, title, description, answer, solutions){
        var x = null;
        if(this.length === 0){
            x = new Task(0, owner, task_type, subject, title, description, answer, solutions);
        }else{
            x = new Task(this[this.length-1].id+1, owner, task_type, subject, title, description, answer, solutions);
        }
        if(x !== null){
            this.push(x);
        }
        console.log("Tasks length : " + this.length);
    }
    //FIND METHODS
    findById(id){
        return this.find(obj => obj.id === id);
    }
    //FILTER METHODS
    filterByOwner(owner){
        return this.filter(obj => obj.owner.email === owner.email);
    }
    filterBySubject(subject){
        return this.filter(obj => obj.subject === subject);
    }
    //GET METHODS
    getIndexById(id){
        return this.indexOf(this.find(obj => obj.id === id));
    }
    //DELETE METHODS
    deleteById(id){
        if(id>=0){
            this.splice(id,1);
        }
    }
}
module.exports = Tasks;