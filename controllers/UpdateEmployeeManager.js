const inquirer = require('inquirer')
const db = require('../DB/DatabaseManager')

module.exports = {
    run: async () => {
        return inquirer.prompt([
            {
                message: `Which employee's manager would you like to update?`,
                type: 'list',
                choices: async answers => {
                    let emps = await db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee`)
                    return emps
                },
                name: 'employeeId'
            },{
                message: `Who is their new manager?`,
                type: 'list',
                name: 'newManager',
                choices: async answers => {
                    let emps = await db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee WHERE id <> ${answers.employeeId}`)
                    return emps
                }
            }
        ]).then(async answers => {
            return await db.updateEmployeeManager(answers.employeeId, answers.newManager)
        })
    }
}