// Dependencies
const mysql = require("mysql")
const inquirer = require("inquirer")

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
        name: 'action',
        message: `What would you like to ${action}?`,
        choices: ['department', 'role', 'employee', 'none']
    }
}

async function add() {
    const {table} = await inquirer.prompt(question('add'))
    if (table !== 'none') {
        // TODO: write function
    }
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

async function init() {
    // keep it going until user wants to exit
    let exit = false
    while (!exit) {
        const act = await userAction()  
        if (act !== 'Exit') {
            switch(act) {
                case "Add":
                    await add()
                    break
                case "View":
                    await view()
                    break;
                case "Update":
                    await update();
                    break;
            }
        } else {
            exit = true;
        }
    }
}

init()