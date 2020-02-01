const inquirer = require('inquirer')
const DB = require('../DB/DatabaseManager')

function chooseDepartment() {
    return inquirer.prompt([
        {
            name: 'department',
            message: 'Choose a Department',
            type: 'list',
            choices: async () => {
                var departments = await DB.getAllDepartments();
                return departments.map(row => row.name)
            }
        }
    ]).then(answers => answers.department)
}

function chooseManager() {
    return inquirer.prompt([
        {
            name: 'manager',
            message: 'Choose a Manager',
            type: 'list',
            choices: async () => {
                var rows = await DB.getAllManagers();
                return rows.map(row => {
                    return {
                        'name' : row.first_name + ' ' + row.last_name,
                        'value' : row.id
                    }
                })
            }
        }
    ]).then(answers => answers.manager)
}

module.exports = {
    'chooseDepartment' : chooseDepartment,
    'chooseManager' : chooseManager
}