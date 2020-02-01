const inquirer = require('inquirer')
const db = require('../DB/DatabaseManager')

module.exports = {
    run: async () => {
        return inquirer.prompt([
            {
                message: `Which employee's role would you like to update?`,
                type: 'list',
                choices: async answers => {
                    let emps = await db.query(`SELECT id as value, CONCAT(first_name, ' ', last_name) as name FROM employee`)
                    return emps
                },
                name: 'employeeId'
            },{
                message: `What role do you want to change it to?`,
                type: 'list',
                name: 'newRole',
                choices: async answers => {
                    let roles = await db.getAllRoles()
                    return roles.map(role => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                }
            }
        ]).then(async answers => {
            return await db.updateEmployeeRole(answers.employeeId, answers.newRole)
        })
    }
}