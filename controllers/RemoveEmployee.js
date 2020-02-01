const inquirer = require('inquirer')
const db = require('../DB/DatabaseManager')

module.exports = {
    run: async () => {
        return inquirer.prompt([
            {
                message: 'Who would you like to remove?',
                type: 'list',
                choices: async answers => {
                    let emps = await db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee`)
                    return emps
                },
                name: 'employeeId'
            }
        ]).then(async answers => {
            let results = await db.removeEmployee(answers.employeeId)
            return results
        })
    }
}