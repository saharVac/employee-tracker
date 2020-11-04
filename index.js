// Dependencies
const mysql = require("mysql")
const inquirer = require("inquirer")

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employeesDB"
});

// Initiate MySQL Connection.
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }});

async function userAction() {
    const {action} = await inquirer.prompt({
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: ['Add', 'View', 'Update', 'Exit']
    })
    return action
}

function question(action) {
    return {
        type: 'list',
        name: 'table',
        message: `What would you like to ${action}?`,
        choices: ['department', 'role', 'employee', 'none']
    }
}

// FUNCTIONS HANDLING ADDING DATA

async function askForDepartment() {
    const { departmentName: department } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "What's the department you'd like to add?"
    })
    return department
}

async function askForRole() {
    const { title, salary } = await inquirer.prompt([{
        type: "input",
        name: "title",
        message: "What's the role title?"
    },{
        type: "input",
        name: "salary",
        message: "What's the role's salary?"
    }])
    await viewTable('department')
    const { departmentID } = await inquirer.prompt({
        type: "input",
        name: "departmentID",
        message: `Enter the ID of the department the role belongs to:`
    })

    // set the role
    role = {
        title: title,
        salary: salary,
        departmentID: departmentID
    }

    return role
}

async function askForEmployee() {
    const { firstName, lastName } = await inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "What's the employee's first name?"
    },{
        type: "input",
        name: "lastName",
        message: "What's the employee's last name?"
    }])
    await viewTable('role');
    const { roleID } = await inquirer.prompt({
        type: "input",
        name: "roleID",
        message: `Enter the ID of the employee's role:`
    })
    await viewManagers()
    const { managerID } = await inquirer.prompt({
        type: "input",
        name: "managerID",
        message: `Enter the ID of the employee's manager:`
    })

    // set the employee
    employee = {
        firstName: firstName,
        lastName: lastName,
        roleID: roleID,
        managerID: managerID
    }

    return employee
}

function addDepartment(department) {

    connection.query(`INSERT INTO department (name) values ('${department}')`, function(err) {
        if (err) throw err;
    })

    return console.log(department, "department added!")
}

function addRole(role) {

    connection.query(`INSERT INTO role (title, salary, department_id) values ('${role.title}', '${role.salary}', '${role.departmentID}')`, function(err) {
        if (err) throw err;
    })

    return console.log(role.title, " role added!")
}

function addEmployee(employee) {

    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) values ('${employee.firstName}', '${employee.lastName}', '${employee.roleID}', '${employee.managerID}')`, function(err) {
        if (err) throw err;
    })

    return console.log(employee.firstName, employee.lastName, "added!")
}

async function addToTable(table) {
    switch(table) {
        case "department":
            const department = await askForDepartment();
            await addDepartment(department);
            break;
        case "role":
            const role = await askForRole();
            await addRole(role)
            break;
        case "employee":
            const employee = await askForEmployee()
            console.log(employee)
            await addEmployee(employee)
            break;
    }
}

async function viewTable(table) {
    if (table !== 'none') {
        await connection.query(`SELECT * FROM ${table};`, async function(err, data) {
            if (err) throw err;
            data.forEach(row => console.log(row))
        });
    }
}

async function viewManagers() {
    await connection.query(`SELECT * FROM employee INNER JOIN role ON (employee.role_id = role.id) WHERE role.title = "manager"`, async function(err, data) {
        if (err) throw err;
        data.forEach(row => console.log(row))
    });
    
}

async function whichID(table) {
    const { ID } = await inquirer.prompt({
        type: "input",
        name: "ID",
        message: `Enter the ID of the ${table} you would like to update:`
    })
    return ID
}

async function updateDepartment(id) {
    const { departmentName: departmentName } = await inquirer.prompt({
        type: "input",
        name: "departmentName",
        message: "What's the new department name?"
    })
    // UPDATE
    connection.query(`UPDATE department SET name = '${departmentName}' WHERE id = '${id}'`, function(err) {
        if (err) throw err;
    })

    return console.log(departmentName, "updated!")
}

async function updateRole(id) {
    const { title, salary } = await inquirer.prompt([{
        type: "input",
        name: "title",
        message: "What's the role title?"
    },{
        type: "input",
        name: "salary",
        message: "What's the role's salary?"
    }])
    await viewTable('department')
    const { departmentID } = await inquirer.prompt({
        type: "input",
        name: "departmentID",
        message: `Enter the ID of the department the role belongs to:`
    })
    // UPDATE
    connection.query(`UPDATE role SET title = '${title}', salary = '${salary}', department_id = '${departmentID}' WHERE id = '${id}'`, function(err) {
        if (err) throw err;
    })

    return console.log(title, " role updated!")
}

async function updateEmployee(id) {
    const { firstName, lastName } = await inquirer.prompt([{
        type: "input",
        name: "firstName",
        message: "What's the employee's first name?"
    },{
        type: "input",
        name: "lastName",
        message: "What's the employee's last name?"
    }])
    await viewTable('role');
    const { roleID } = await inquirer.prompt({
        type: "input",
        name: "roleID",
        message: `Enter the ID of the employee's role:`
    })
    await viewManagers()
    const { managerID } = await inquirer.prompt({
        type: "input",
        name: "managerID",
        message: `Enter the ID of the employee's manager:`
    })

    // UPDATE
    connection.query(`UPDATE employee SET first_name = '${firstName}', last_name = '${lastName}', role_id = '${roleID}', manager_id = '${managerID}' WHERE id = '${id}'`, function(err) {
        if (err) throw err;
    })

    return console.log(firstName, lastName, " updated!")
}

async function update(table, id) {
    switch(table) {
        case "department":
            await updateDepartment(id);
            break;
        case "role":
            await updateRole(id);
            break;
        case "employee":
            await updateEmployee(id);
            break;
    }
}

async function updateTable(table) {
    switch(table) {
        case "department":
            await viewTable('department')
            const departmentID = await whichID('department')
            await update('department', departmentID)
            break;
        case "role":
            await viewTable('role')
            const roleID = await whichID('role')
            await update('role', roleID)
            break;
        case "employee":
            const employeeID = await whichID('employee')
            await update('employee', employeeID)
            break;
    }
}

async function getTable(action) {
    const { table } = await inquirer.prompt(question(action))
    return table
}

// MAIN FUNCTION KEEPING THE APP GOING

async function init() {
    let table;
    // keep it going until user wants to exit
    let exit = false
    while (!exit) {
        // Take in user's intended action
        const act = await userAction()  
        if (act !== 'Exit') {
            switch(act) {
                case "Add":
                    table = await getTable('add');
                    await addToTable(table)
                    // addToTable(table)
                    break;
                case "View":
                    table = await getTable('view')
                    await viewTable(table)
                    break;
                case "Update":
                    table = await getTable('update');
                    await updateTable(table)
                    break;
            }
        } else {
            exit = true;
        }
    }

    connection.end()
}

init()