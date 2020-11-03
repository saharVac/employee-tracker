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

async function addDepartment(department) {

    connection.query(`INSERT INTO department (name) values ('${department}')`, function(err) {
        if (err) throw err;
    })

    return console.log(department, "department added!")
}

async function addToTable(table) {
    switch(table) {
        case "department":
            const department = await askForDepartment();
            addDepartment(department);
            break;
        case "role":
            break;
        case "employee":
            break;
    }
}

// FUNCTIONS HANDLING DATA

async function add() {
    const { table } = await inquirer.prompt(question('add'))
    return table
}

async function view() {
    const {table} = await inquirer.prompt(question('view'))
    if (table !== 'none') {
        // TODO: write function
    }
}

async function update() {
    // TODO: write function
}

// MAIN FUNCTION KEEPING THE APP GOING

async function init() {
    // keep it going until user wants to exit
    let exit = false
    while (!exit) {
        // Take in user's intended action
        const act = await userAction()  
        if (act !== 'Exit') {
            switch(act) {
                case "Add":
                    const table = await add();
                    await addToTable(table)
                    // addToTable(table)
                    break;
                case "View":
                    view()
                    break;
                case "Update":
                    update();
                    break;
            }
        } else {
            exit = true;
        }
    }

    connection.end()
}

init()