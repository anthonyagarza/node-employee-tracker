const db = require('./DB/DatabaseManager')
const inquirer = require('inquirer')
const process = require('process')
const questions = require('./lib/questions')


function exitApp() {
    db.closeConnection()
    console.log('Goodbye!')
    process.exit()
}

process.on('beforeExit', (code) => {
    console.log('Process beforeExit event with code: ', code);
    exitApp();
});

async function whatToDo() {
    let answers = await inquirer.prompt([
        {
            'type' : 'list',
            'name' : 'operation',
            'message' : 'What would you like to do?',
            'choices' : [
                'View All Employees',
                'View All Employees by Department',
                'View All Employees by Manager',
                'Add Employee',
                'Remove Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'Exit'
            ]
        }
    ])
    if (answers.operation == 'View All Employees') {
        let data = await db.getAllEmployees()
        console.table(data);
        whatToDo();
    } else if (answers.operation == 'View All Employees by Department') {
        let deptName = await questions.chooseDepartment()
        let emps = await db.getEmployeesByDept(deptName)
        console.table(emps)
        whatToDo();
    } else if ('Exit') {
        exitApp();
    }
}

whatToDo();