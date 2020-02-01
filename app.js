const db = require('./DB/DatabaseManager')
const inquirer = require('inquirer')
const process = require('process')
const questions = require('./controllers/questions')
const AddEmployee = require('./controllers/AddEmployee')
const RemoveEmployee = require('./controllers/RemoveEmployee')
const UpdateEmployeeRole = require('./controllers/UpdateEmployeeRole')
const UpdateEmployeeManager = require('./controllers/UpdateEmployeeManager')


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
    const op = answers.operation
    if (op == 'View All Employees') {
        let data = await db.getAllEmployees()
        console.table(data);
    } else if (op == 'View All Employees by Department') {
        let deptName = await questions.chooseDepartment()
        let emps = await db.getEmployeesByDept(deptName)
        console.table(emps)
    } else if (op == 'View All Employees by Manager') {
        let manager = await questions.chooseManager()
        console.table(await db.getEmployeesByManager(manager))
    } else if (op == 'Add Employee') {
        let employee = await AddEmployee.run()
        console.log(`Added ${employee.first_name} ${employee.last_name} to the database.`)
    } else if (op == 'Remove Employee') {
        await RemoveEmployee.run()
        console.log('Removed Employee')
    } else if (op == 'Update Employee Role') {
        await UpdateEmployeeRole.run()
        console.log('Role updated')
    } else if (op == 'Update Employee Manager') {
        await UpdateEmployeeManager.run()
        console.log('Manager Updated')
    } else if ('Exit') {
        exitApp();
    }
    whatToDo();
}

whatToDo();