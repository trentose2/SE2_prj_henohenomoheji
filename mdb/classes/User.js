class User{
    /*
    id(integer) PRIMARY KEY
    name(string)
    surname(string)
    email(string) UNIQUE
    password(string)
    type(string) #teacher or student
    */
    constructor(id, name, surname, email, password, type){
        this.id = id;this.name = name; this.surname = surname; 
        this.email = email; this.password = password; this.type = type;
    }
    update(name, surname, email, password){
        (name !== "" || name !== undefined) ? this.name = name : console.log("T_T"); 
        (surname !== "" || surname !== undefined) ? this.surname = surname : console.log("T_T");
        (email !== "" || email !== undefined) ? this.email = email : console.log("T_T"); 
        (password !== "" || password !== undefined) ? this.password = password : console.log("T_T"); 
    }
    toString(){
        return "\x1b[36m ID : " + this.id + "\x1b[0m (NAME : " + this.name + ", SURNAME : " + this.surname + 
        ", EMAIL : " + this.email + ", PWD : " + this.password +")\n";
    }
}
class Users extends Array{
    //ADD METHOD
    add(name, surname, email, password){
        var x = null;
        if(this.length === 0){
            x = new User(0, name, surname, email, password);
        }else{
            if(this.find(obj => obj.email === email) === undefined){
                x = new User(this[this.length-1].id+1, name, surname, email, password);
            }
        }
        if(x !== null){
            this.push(x);
        }
        console.log("Users length : " + this.length);
    }
    //FIND METHODS
    getUserByEmail(email){
        return this.find(obj => obj.email === email);
    }
    getUserById(id){
        return this.filter(obj => obj.id === id);
    }
    //FILTER METHODS
    filterByName(name){
        return this.filter(obj => obj.name === name);
    }
    //GET METHODS
    getUserIndexByEmail(email){
        return this.indexOf(this.find(obj => obj.email === email));
    }
    //DELETE METHODS
    deleteByEmail(email){
        var id = this.indexOf(this.find(obj => obj.email === email));
        if(id>=0){
            this.splice(id,1);
        }
    }
}
module.exports = Users;