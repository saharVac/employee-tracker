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


async function init() {
    // keep it going until user wants to exit
    let exit = false
    while (!exit) {
        const act = await userAction()  
        if (act !== 'Exit') {

        } else {
            exit = true;
        }
    }
}

init()
