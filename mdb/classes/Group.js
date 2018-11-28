class Group{
    /* 
    id(integer) PRIMARY KEY
    owner(User) FOREIGN KEY
    name(string) UNIQUE
    description(string)
    members(User[]) "MULTIPLE" FOREIGN KEY
    */
    constructor(id, owner, name, description, members){
        this.id = id; this.owner = owner; this.name = name; this.description = description; this.members = members;
    }
    update(name, description, members){
        (name !== "" || name !== undefined) ? this.name = name : console.log("T_T");
        (description !== "" || description !== undefined) ? this.description = description : console.log("T_T"); 
        (members !== "" || members !== undefined) ? this.members = members : console.log("T_T"); 
    }
    getRandomMember(){
        return this.members[Math.floor(Math.random()*this.members.length)];
    }
    toString(){
        return "\x1b[32mID : " + this.id + "\x1b[0m\nOWNER -> " + this.owner + "NAME : " + this.name +
               ", DESCRIPTION : " + this.description + "\nMEMBERS -> " + this.members;
    }
    getMembersId(){
        let members_ids = [];
        for (let i=0; i<this.members.length; i++){
            members_ids[i]=this.members[i].id;
        }
        return members_ids;
    }
}
class Groups extends Array{
    //ADD METHOD
    add(owner, name, description, members){
        var x = null;
        if(this.length === 0){
            x = new Group(0, owner, name, description, members);
        }else{
            if(this.find(obj => obj.name === name) === undefined){
                x = new Group(this[this.length-1].id+1, owner, name, description, members);
            }
        }
        if(x !== null){
            this.push(x);
            console.log("Groups length : " + this.length);
            return true;
        }
        console.log("Groups length : " + this.length);
    }

    //UPDATE METHOD
    updateById(id, name, description, members){
        var group = this.getGroupById(id);
        if (group !== null&&group!==undefined){
            group.update(name, description, members);
            return 200;
        } else{
            return 400;
        }
    }
    //FILTER METHODS
    filterByOwner(owner){
        return this.filter(obj => obj.owner.email === owner.email);
    }
    //GET METHODS
    getAll(){
        return this;
    }
    getIndexById(id){
        return this.indexOf(this.find(obj => obj.id === id));
    }
    getGroupById(id){
        return this.find(obj => obj.id === id);
    }
    getGroupByName(name){
        return this.find(obj => obj.name === name);
    }
    //DELETE METHODS
    deleteByName(name){
        var index = this.indexOf(this.find(obj => obj.name === name));
        if(index>=0){
            this.splice(index,1);
        }
    }
    deleteById(id){
        var index = this.indexOf(this.find(obj => obj.id === id));
        if(index>=0){
            this.splice(index,1);
            return 200;
        } else {
            return 404;
        }
    }
}
module.exports = Groups;