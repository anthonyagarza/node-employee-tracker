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
    ]).then(answers => {
        return answers.department
    })
}

module.exports = {
    'chooseDepartment' : chooseDepartment
}