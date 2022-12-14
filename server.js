const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');
const inquirer = require('inquirer');
const port = process.env.PORT || 3000;
require("console.table");

//Create database query string
const createDatabase = require('./sql/createDatabase.sql');

//Create tables query string
const createFullEmployee = require('./sql/tables/fullEmployee.sql');
const createEmployee = require('./sql/tables/employee.sql')
const createDepartment = require('./sql/tables/department.sql');
const createRole = require('./sql/tables/role.sql');

//Create procedures query string
const fullEmployeePro = require('./sql/procedures/fullEmployeePro.sql');
const employeePro = require('./sql/procedures/employeePro.sql');
const rolePro = require('./sql/procedures/rolePro.sql');
const departPro = require('./sql/procedures/departmentPro.sql');

app.use(express.static('public'));
app.use(express.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '[YourPasswordHere]',
            //^^Enter Password Here
    multipleStatements: true,
    insecureAuth: true
});


//Query to initalize database
connection.query(createDatabase, function (error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})


//Querys to initalize tables
connection.query(createFullEmployee, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})

connection.query(createEmployee, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})

connection.query(createRole, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})


connection.query(createDepartment, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})



//Querys to initalize procedures
connection.query(fullEmployeePro, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})

connection.query(employeePro, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})

connection.query(rolePro, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})

connection.query(departPro, function(error) {
    if (error) {
        console.log(error)
    }
    if (!error) {
    }
})



console.log("START");
app.listen(port);
console.log(`listening on port ${port}`);


//Menu Question
const menuQ = [
    {
        type: "list",
        message: "What employee type would you like to add",
        name: "choice",
        choices: ["View All Employees", "Add Employee", "Update Employee", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit"],
    },
];




//Global variables
let startUp = true;
let allEmpData;
let roleData;
let departData;
let roleArr;
let employeeArr;
let departArr;
let currId;



start();



async function start(err) {
    if (err) throw err;
    //Only throws start screen once
    if (startUp == true) {
        console.log(`
        ????????????????????????????????????????????????????????????????????????????????????????????????
        ????????????????????????????????????????????????????????????????????????????????????????????????
        ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????`)

        startUp = false;
    }

    const menuA = await inquirer.prompt(menuQ);


    if (menuA.choice == "View All Employees") {
        //Logs the table to the console
        await viewAllEmployees();
        setTimeout(function () {
            start();
        }, 100)
    }

    if (menuA.choice == "Add Employee") {
        //Sets all the store global data variables
        await getEmployees();
        await getRoles();
        await getDepart();
        //Writes over table
        setTimeout(async function () {
            //Sets currId to 0 so the procedures auto increment
            currId = 0;
            roleArr = new Array;
            employeeArr = new Array;
            departArr = new Array;
            let matchIndex = new Array;


            //Find repeating role values
            for (let i = 0; i < roleData.length; i++) {
                for (let j = 0; j < roleData.length; j++) {
                    if (roleData[i].title == roleData[j].title && i != j) {
                        matchIndex[matchIndex.length] = i;
                    }
                }
            }

            //Sets each value of the Roles table into an Array
            //The array will contain the Department if the values repeat
            for (let i = 0; i < roleData.length; i++) {
                let passed = true;
                for (let j = 0; j < matchIndex.length; j++) {
                    if (matchIndex[j] == i) {
                        passed = false;
                    }
                }
                if (passed == false) {
                    roleArr[roleArr.length] = `${roleData[i].title} (${departData[roleData[i].department_id - 1].name})`;
                }
                if (passed == true) {
                    roleArr[roleArr.length] = `${roleData[i].title}`;
                }

            }
            //Sets none at the back of the array
            roleArr[roleArr.length] = 'None';


            //Sets the fullname of each employee to be set as managers if needed
            for (let i = 0; i < allEmpData.length; i++) {
                fullName = ''
                fullName = allEmpData[i].first_name;
                fullName += ' ';
                fullName += allEmpData[i].last_name;
                employeeArr[employeeArr.length] = `${fullName}`;
            }

            //Sets N/A at the back of the array
            employeeArr[employeeArr.length] = 'N/A'



            //Employee Questions
            const employeeQ = [
                {
                    type: "input",
                    message: "what is the employees first name",
                    name: "firstName",
                    validate: function (firstName) {
                        if (firstName) {
                            return true;
                        } else {
                            console.log("\nInvaild Name (try again)");
                            return false;
                        }
                    },
                },
                {
                    type: "input",
                    message: "what is the employees last name",
                    name: "lastName",
                    validate: function (lastName) {
                        if (lastName) {
                            return true;
                        } else {
                            console.log("\nInvaild Name (try again)");
                            return false;
                        }
                    },
                },
                {
                    type: "list",
                    message: "What's employees role would you like to add",
                    name: "role",
                    //Sets the choices to the role array
                    choices: function () { return roleArr },
                },
                {
                    type: "list",
                    message: "Who's the employees manager",
                    name: "manager",
                    //Sets the choices the employee array
                    choices: function () { return employeeArr },
                },
            ]

            const addEmp = await inquirer.prompt(employeeQ);




            //Parses thorugh the data

            let currDepart = addEmp.role;

            //Splits currDepart into an array by the parenthathese that are used to contain the department in repeating role values
            currDepart = currDepart.split(' (');

            let currRole;
            let foundDepart = false
            //If currDepart has more than 1 value in the array or is an array the if will conitionalize to true thus setting the department and role
            if (currDepart[1]) {
                currRole = currDepart[0];
                currDepart = currDepart[1];
                currDepart = currDepart.split(')');
                currDepart = currDepart[0];
                foundDepart = true;
            }
            let currDepartId;

            //If currDepart is not an array this function is used to find the current role and the department id
            if (foundDepart == false) {
                currRole = addEmp.role;
                for (let i = 0; i < roleData.length; i++) {
                    if (addEmp.role == roleData[i].title) {
                        currDepartId = roleData[i].department_id;
                    }

                }
            }


            //The department id is then used to get the current department name value from the id
            for (let i = 0; i < departData.length; i++) {
                if (currDepartId == departData[i].id) {
                    currDepart = departData[i].name;
                }
            }

            let managerId;
            let departId;
            let roleId;
            let salary;

            //The name is them conditonalilized to get the department id from the department data
            //NOTE this is not needed but useful for linearity because I did this on a diffent day
            for (let i = 0; i < departData.length; i++) {
                if (departData[i].name == currDepart) {
                    departId = departData[i].id;
                }
            }


            //This is used to conitionalize both the role and department to get the role and salary values
            //NOTE this is not needed but useful for linearity because I did this on a diffent day
            for (let i = 0; i < roleData.length; i++) {
                if (roleData[i].title == currRole && roleData[i].department_id == departId) {
                    roleId = roleData[i].id;
                    salary = roleData[i].salary;
                }
            }

            //Finds the manager Id
            for (let i = 0; i < allEmpData.length; i++) {
                if (addEmp.manager == 'N/A') {
                    break;
                }
                let fullName = `${allEmpData[i].first_name} ${allEmpData[i].last_name}`;
                if (fullName == addEmp.manager) {
                    managerId = allEmpData[i].id;
                }
            }


            //Sets full employee data object
            let fullData = {
                id: currId,
                firstName: addEmp.firstName,
                lastName: addEmp.lastName,
                department: currDepart,
                salary: salary,
                title: currRole,
                manager: addEmp.manager
            }


            //Sets employee data object
            let data = {
                id: currId,
                firstName: addEmp.firstName,
                lastName: addEmp.lastName,
                role_id: roleId,
                manager_id: managerId

            }

            //Both functions add data to there respective SQL tables
            addFullEmpData(fullData)

            addEmpData(data);


            //Calls the beginning prompt
            return start();

        }, 100)

    }

    if(menuA.choice == "Update Employee") {
        //Sets all the store global data variables
        await getEmployees();
        await getRoles();
        await getDepart();
        setTimeout(async function () {
            employeeArr = new Array;
            roleArr = new Array;
            employeeArr = new Array;
            departArr = new Array;
            let matchIndex = new Array;

            //Sets Array of full employee names
            for (let i = 0; i < allEmpData.length; i++) {
                fullName = '';
                fullName = allEmpData[i].first_name;
                fullName += ' ';
                fullName += allEmpData[i].last_name;
                employeeArr[employeeArr.length] = `${fullName}`;
            }
            employeeArr[employeeArr.length] = 'N/A';


            const getEmpQ = {
                type: "list",
                message: "Which Employee would you like to update",
                name: "employee",
                //Sets the choices the employee array
                choices: function () { return employeeArr },
            }
            //Prompt the user with names of the employee to be updated
            const upEmp = await inquirer.prompt(getEmpQ);
            let empId;

            //Sets currId for database to overwrite
            for (let i = 0; i < allEmpData.length; i++) {
                if (upEmp.employee == 'N/A') {
                    return start();
                }
                let fullName = `${allEmpData[i].first_name} ${allEmpData[i].last_name}`;
                if (fullName == upEmp.employee) {
                    empId = allEmpData[i].id;
                }
            }
            currId = empId;


            //Find repeating role values
            for (let i = 0; i < roleData.length; i++) {
                for (let j = 0; j < roleData.length; j++) {
                    if (roleData[i].title == roleData[j].title && i != j) {
                        matchIndex[matchIndex.length] = i;
                    }
                }
            }

            //Sets each value of the Roles table into an Array
            //The array will contain the Department if the values repeat
            for (let i = 0; i < roleData.length; i++) {
                let passed = true;
                for (let j = 0; j < matchIndex.length; j++) {
                    if (matchIndex[j] == i) {
                        passed = false;
                    }
                }
                if (passed == false) {
                    roleArr[roleArr.length] = `${roleData[i].title} (${departData[roleData[i].department_id - 1].name})`;
                }
                if (passed == true) {
                    roleArr[roleArr.length] = `${roleData[i].title}`;
                }

            }
            //Sets none at the back of the array
            roleArr[roleArr.length] = 'None';


            let employeeArr2 = new Array;

            //Creates a second array that dosen't include the currently selected employee
            for(let i = 0; i < employeeArr.length; i++) {
                if(upEmp.employee != employeeArr[i]) {
                    employeeArr2[employeeArr2.length] = employeeArr[i];
                }
            }

            const updateQ = [
            {
                type: "list",
                message: "What's employees role would you like to add",
                name: "role",
                //Sets the choices to the role array
                choices: function () { return roleArr },
            },
            {
                type: "list",
                message: "Who's the employees manager",
                name: "manager",
                //Sets the choices the employee array
                choices: function () { return employeeArr2 },
            },]


            //Prompts the user for updated values
            const updateVal = await inquirer.prompt(updateQ);





            //Parses thorugh the data

            let currDepart = updateVal.role;

            //Splits currDepart into an array by the parenthathese that are used to contain the department in repeating role values
            currDepart = currDepart.split(' (');

            let currRole;
            let foundDepart = false
            //If currDepart has more than 1 value in the array or is an array the if will conitionalize to true thus setting the department and role
            if (currDepart[1]) {
                currRole = currDepart[0];
                currDepart = currDepart[1];
                currDepart = currDepart.split(')');
                currDepart = currDepart[0];
                foundDepart = true;
            }
            let currDepartId;

            //If currDepart is not an array this function is used to find the current role and the department id
            if (foundDepart == false) {
                currRole = updateVal.role;
                for (let i = 0; i < roleData.length; i++) {
                    if (updateVal.role == roleData[i].title) {
                        currDepartId = roleData[i].department_id;
                    }

                }
            }


            //The department id is then used to get the current department name value from the id
            for (let i = 0; i < departData.length; i++) {
                if (currDepartId == departData[i].id) {
                    currDepart = departData[i].name;
                }
            }

            let managerId;
            let departId;
            let roleId;
            let salary;

            //The name is them conditonalilized to get the department id from the department data
            //NOTE this is not needed but useful for linearity because I did this on a diffent day
            for (let i = 0; i < departData.length; i++) {
                if (departData[i].name == currDepart) {
                    departId = departData[i].id;
                }
            }


            //This is used to conitionalize both the role and department to get the role and salary values
            //NOTE this is not needed but useful for linearity because I did this on a diffent day
            for (let i = 0; i < roleData.length; i++) {
                if (roleData[i].title == currRole && roleData[i].department_id == departId) {
                    roleId = roleData[i].id;
                    salary = roleData[i].salary;
                }
            }

            //Finds the manager Id
            for (let i = 0; i < allEmpData.length; i++) {
                if (updateVal.manager == 'N/A') {
                    break;
                }
                let fullName = `${allEmpData[i].first_name} ${allEmpData[i].last_name}`;
                if (fullName == updateVal.manager) {
                    managerId = allEmpData[i].id;
                }
            }



            let name = upEmp.employee.split(' ');

            let firstName = name[0];
            let lastName = name[1];

            //Sets full employee data object
            let fullData = {
                id: currId,
                firstName: firstName,
                lastName: lastName,
                department: currDepart,
                salary: salary,
                title: currRole,
                manager: updateVal.manager
            }


            //Sets employee data object
            let data = {
                id: currId,
                firstName: firstName,
                lastName: lastName,
                role_id: roleId,
                manager_id: managerId

            }

            if(managerId == currId) {
                console.log("manager cannot be the same employee");
            }
            //Both functions add data to there respective SQL tables
            if(managerId != currId) {
                addFullEmpData(fullData)
                addEmpData(data);
            }

            return start();
        }, 100)
    }

    if(menuA.choice == "View All Roles") {
        //Sets all the store global data variables
        await getRoles();
        await getDepart();
        //Sets the data to be logged to the console
        setTimeout(function () {
            for(let i = 0; i < roleData.length; i++) {
                for(let j = 0; j < departData.length; j++) {
                    if(roleData[i].department_id == departData[j].id) {
                        roleData[i].department_id = departData[j].name;
                    }
                }
            }
            console.table(roleData);
            return start();
        }, 100)
    }

    if(menuA.choice == "Add Role") {
        //Sets all the store global data variables
        await getRoles();
        await getDepart();
        setTimeout(async function () {
            //Sets currId to 0 so the procedures auto increment
            currId = 0;
            departArr = new Array;
            //Sets department array
            for(let i = 0; i < departData.length; i++) {
                departArr[departArr.length] = departData[i].name;
            }

            if(departData.length == 0) {
                console.log("No Departments, create a department to add roles")
                return start();
            }

            //New roles question
            const roleQ = [
                {
                    type: "input",
                    message: "what is the role title",
                    name: "title",
                    validate: function (title) {
                        if (title) {
                            return true;
                        } else {
                            console.log("\nInvaild Title (try again)");
                            return false;
                        }
                    },
                },
                {
                    type: "input",
                    message: "what is the salary",
                    name: "salary",
                    validate: function (salary) {
                        salary = Number(salary)
                        if (salary && salary != NaN) {
                            return true;
                        } else {
                            console.log("\nInvaild Salary (try again)");
                            return false;
                        }
                    },
                },
                {
                    type: "list",
                    message: "What department will this role reside in",
                    name: "depart",
                    //Sets the choices to the role array
                    choices: function () { return departArr },
                },
            ]

            const addRole = await inquirer.prompt(roleQ);

            let departId;


            //Finds the department Id based on the user selected name
            for(let i = 0; i < departData.length; i++) {
                if(addRole.depart == departData[i].name) {
                    departId = departData[i].id;
                }
            }

            //data object to be used as values that're stored in the database
            let data = {
                id: currId,
                title: addRole.title,
                salary: addRole.salary,
                department_id: departId
            }

            let check = true


            //Checks to see if the role already exists inside the same department of the database
            for(let i =0; i < roleData.length; i++) {
                if(addRole.title == roleData[i].title && departId == roleData[i].department_id) {
                    check = false;
                }
            }
            if (check == true) {
                roleAdd(data);
            }

            if (check == false) {
                console.log('Unable to input repeat value inside the same department')
            }

            return start();



        }, 100);
    }

    if(menuA.choice == "View All Departments") {
        //Logs the table to the console
        await viewDepartment();
        setTimeout(function () {
            start();
        }, 100)
    }

    if(menuA.choice == 'Add Department') {
        //Sets all the store global data variables
        await getRoles();
        await getDepart();
        setTimeout(async function () {
            currId = 0;
            const departQ = [
                {
                    type: "input",
                    message: "what is the department name",
                    name: "title",
                    validate: function (title) {
                        if (title) {
                            return true;
                        } else {
                            console.log("\nInvaild Name (try again)");
                            return false;
                        }
                    },
                }
            ]

            //Prompts the user for a department name
            const addDepart = await inquirer.prompt(departQ);


            //Sets data object
            let data = {
                id: currId,
                name: addDepart.title
            }

            //Checks to see if the department is a repeat value
            const check = true
            for(let i = 0; i < departData.length; i ++) {
                if(departData[i].name == addDepart.title) {
                    check == false;
                }
            }

            if (check == true) {
                departAdd(data);
            }

            if (check == false) {
                console.log('Unable to input repeat department names')
            }

            return start();
        }, 100)
        

    }

    if(menuA.choice == 'Quit') {
        process.exit();
    }



};




async function viewAllEmployees() {
    //Grabs all from employeesDB.employeeData
    connection.query('SELECT * FROM employeesDB.employeeData', (error, rows) => {
        if (error) {
            console.log('error');
        }
        if (!error) {
            //console.log('Success');
            //Prints to console
            console.table(rows);
            return rows


        }
    })
}


function viewDepartment() {
    //Grabs all from employeesDB.department
    connection.query('SELECT * FROM employeesDB.department', (error, rows) => {
        if (error) {
            console.log('error');
        }
        if (!error) {
            //console.log('Success');
            //Prints to console
            console.table(rows);
            return

        }
    })
}


function getEmployees() {
    //Grabs all from employeesDB.employee
    connection.query('SELECT * FROM employeesDB.employee', (error, rows) => {
        if (error) {
            console.log('error');
        }
        if (!error) {
            //console.log('Success');
            //Sets global object
            allEmpData = rows
            return rows

        }
    })
}


function getRoles() {
    //Grabs all from employeesDB.role
    connection.query('SELECT * FROM employeesDB.role', (error, rows) => {
        if (error) {
            console.log('error');
        }
        if (!error) {
            //console.log('Success');
            //Sets global object
            roleData = rows;
            return rows

        }
    })
}


function getDepart() {
    //Grabs all from employeesDB.department
    connection.query('SELECT * FROM employeesDB.department', (error, rows) => {
        if (error) {
            console.log('error');
        }
        if (!error) {
            //console.log('Success');
            //Sets global object
            departData = rows;
            return rows

        }
    })
}


async function addFullEmpData(data) {
    //Sets the procedure query call syntax
    var sql = "SET @id = ?;SET @first_name = ?;SET @last_name = ?;SET @title = ?;SET @department = ?;SET @salary = ?;SET @manager = ?; \
    CALL addFullEmployee(@id,@first_name,@last_name,@title,@department,@salary,@manager);";
    //calls the procedure query
    connection.query(sql, [data.id, data.firstName, data.lastName, data.title, data.department, data.salary, data.manager], (error, rows) => {
        if (error) {
            console.log(error)
        }
        if (!error) {
        }
    })
}


async function addEmpData(data) {
    //Sets the procedure query call syntax
    var sql = "SET @id = ?;SET @first_name = ?;SET @last_name = ?;SET @role_id = ?;SET @manager_id = ?; \
    CALL addEmployee(@id,@first_name,@last_name,@role_id,@manager_id);";
    //calls the procedure query
    connection.query(sql, [data.id, data.firstName, data.lastName, data.role_id, data.manager_id], (error, rows) => {
        if (error) {
            console.log(error)
        }
        if (!error) {
        }
    })
}


async function roleAdd(data) {
    //Sets the procedure query call syntax
    var sql = "SET @id = ?;SET @title = ?;SET @salary = ?;SET @department_id = ?; \
    CALL addRole(@id,@title,@salary,@department_id);";
    //calls the procedure query
    connection.query(sql, [data.id, data.title, data.salary, data.department_id], (error, rows) => {
        if (error) {
            console.log(error)
        }
        if (!error) {
        }
    })
}


async function departAdd(data) {
    //Sets the procedure query call syntax
    var sql = "SET @id = ?;SET @name = ?; \
    CALL addDepart(@id,@name);";
    //calls the procedure query
    connection.query(sql, [data.id, data.name], (error, rows) => {
        if (error) {
            console.log(error)
        }
        if (!error) {
        }
    })
}









