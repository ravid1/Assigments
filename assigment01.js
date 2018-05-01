var user1 = {name: 'ravid' , password: '12345' , age: 28};
var user2 = {name: 'orel' , password: '123456' , age: 28};
var users = [];
var groups = {};
//var users=[];
users.push(user1);
users.push(user2);
groups["group1"]=[user1,user2];
groups["group2"]=[user1];

const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

main();
function main() {
    rl.question("\nChoose a option:\n1.User\n2.Groups\n3.Users to Group association\n4.Update user profile",menu);
}

function menu(input) {
    console.log(input);
    switch (input) {
        case '1':
            rl.question("Choose:\n1.Create/delete users\n2.Get a list of users in the system\n",function(userinput){
                if(userinput==='1'){
                    rl.question("Choose:\n1.Create user\n2.Delete user",function(input2){
                        if(input2==='1'){
                            createUser();
                        }
                        else{
                            deleteUser();
                        }
                    });
                }
                else if(userinput==='2'){
                    printUsers();
                    main();
                }
            });
            break;

        case '2':
            rl.question("Choose:\n1.Create/delete groups\n2.Get a list of groups in the system",function(groupinput) {
                if(groupinput==='1') {
                    rl.question("Choose:\n1.Create group\n2.Delete group\n", function (groupinput2) {
                        if (groupinput2 === '1') {
                            createGroup();
                        }
                        else if (groupinput2 === '2') {
                            deleteGroup();
                        }
                    });
                }
                else if(groupinput==='2'){
                    printGroups();
                }
            });

            break;

        case '3':
            rl.question("1.Add/remove users to/from group\n2.Get a list of groups and users under each group ",function(inputUTG){
                if(inputUTG==='1'){
                    rl.question("Choose:\n1.Add user to group\n2.Remove user from group",function(inputUTG2){
                        if(inputUTG2==='1'){
                            addToGroup();
                        }
                        else if(inputUTG2=='2'){
                            removeFromGroup();
                        }
                    });
                }
                if(inputUTG==='2'){
                    printAllGroupsUsers();
                }
            });
            break;
        case '4':
            updateUser();
            break;

        default:
            console.log("Not an option! Try again\n");
            main();
            break;
    }
}

function createUser(){
    var newUser={};
    rl.question("Enter the User Name: ",function (newName){
        var found=users.find(function (obj) {
            return newName===obj.name;
        });
        if(found){
            console.log('ERROR!! name already exist please try again\n');
        }
        else{
            newUser["name"]=newName;
            rl.question("Enter password: ", function (password) {
                newUser["password"]=password;
                rl.question("Enter age: ",function (age){
                    newUser["age"]=age;
                    users.push(newUser);
                    main();
                });
            });
        }
    });
}

function deleteUser(){
    rl.question("Enter the name you want to delete: ",function(name){
        var user= findUser(name);
        if(user) {
            users.splice(users.indexOf(user),1);
        }
        else{
            console.log('User deleted!\n');
        }
        removeFromGroups(user);
        main();
    });
}

function findUser(name){
    var user= users.find(function(obj){
        return obj.name===name;
    });
    return user;
}
function printUsers(){
    if(users.length){
        users.forEach( function(user) {
            console.log(user.name);
        });
    }
}

function createGroup(){
    rl.question("Enter a name to the group",function(name){
        if(findGroup(name)){
            console.log("ERROR! Group name already exists\n");
        }
        else{
            groups[name]= [];
        }
        main();
    });
}

function findGroup(name){
    var found= name in groups;
    return found;
}

function deleteGroup(){
    rl.question("Enter a name to the group",function(name){
        if(findGroup(name)){
            delete groups[name];
            console.log("Group",name,"deleted successfully\n");
        }
        else{
            console.log("ERROR! Group dosen't exists\n");
        }
        main();
    });
}

function printGroups() {
    if (groups.toString() === "") {
        console.log("ERROR! No group in system\n");
    }
    else {
        //Object.entries((groups)).forEach(([key]) => console.log(key));
        for(var name in groups){
            console.log(name);
        }
    }
    main();
}

function addToGroup() {
    rl.question("Enter User name and Group name", function(args) {
        var myvar= args.split(" ");
        var user=findUser(myvar[0]);
        var group=findGroup(myvar[1]);
        if(user && group){
            var index=groups[myvar[1]].indexOf(user);
            if(groups[myvar[1]][index]>-1) {// not sure if .indexOf(user) is needed
                console.log(user.name,"already in group\n",group);
            }
            else{

                groups[myvar[1]].push(user);
            }
        }
        else{
            console.log("ERROR! one or two arguments are wrong\n");
        }
        main();
    });
}

function removeFromGroup(){
    rl.question("Enter User name and Group name", function(args){
        var myvar= args.split(" ");
        var user=findUser(myvar[0]);
        var group=myvar[1];
        if(user && findGroup(group)){
            var index= groups[group].indexOf(user);
            if(index>-1){
                groups[group].splice(index,1);
            }
        }
        else{
            console.log("ERROR! one or two arguments are wrong\n");
        }
        main();
    });
}

function printAllGroupsUsers(){
    for(var group in groups) {
        console.log(group);
        groups[group].forEach(function (user) {
            console.log("    ",user.name,"("+user.age+")");
        }) ;
    }
    main();
}

function removeFromGroups(user){
    var userGroups=[];
    for(var group in groups){
        groups[group].find(function(elment){
            if(elment===user){
                userGroups.push(group);
                }
        });
    }

    if(userGroups.length>0){
        userGroups.forEach(function(usergroup) {
            var index=groups[usergroup].indexOf(user);
            groups[usergroup].splice(index,1);
        });
    }
}

function updateUser() {
    rl.question("Enter username",function (name) {
        var user=findUser(name);
        if(user){
            rl.question("Enter new name and age",function(args){
                var myvar=args.split(" ");
                var index=users.indexOf(user);
                users[index].name=myvar[0];
                users[index].age=myvar[1];
                main();
            });
        }
        else{
            console.log("ERROR!User dosen't exists\n");
            main();
        }
    });
}