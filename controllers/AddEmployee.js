const db = require('../DB/DatabaseManager')
const inquirer = require('inquirer')

module.exports = {
    run: async () => {
        return inquirer.prompt([
            {
                message: `What is the employee's first name?`,
                type: 'input',
                name: 'firstName'
            }, {
                message: `What is the employee's last name?`,
                type: 'input',
                name: 'lastName'
            }, {
                message: `What is the employee's role?`,
                type: 'list',
                name: 'role',
                choices: async (answers) => {
                    let roles = await db.getAllRoles()
                    return roles.map(row => {
                        return {
                            'name' : row.title,
                            'value' : row.id
                        }
                    })
                } 
            }, {
                message: `Who is the employee's manager?`,
                type: 'list',
                name: 'manager',
                choices: async () => {
                    let emps = await db.getAllEmployees()
                    return emps.map(row => {
                        return {
                            'name' : row.first_name + ' ' + row.last_name,
                            'value' : row.id
                        }
                    })
                }
            }
        ]).then(async answers => {
            let created = await db.createEmployee({
                first_name: answers.firstName,
                last_name: answers.lastName,
                role_id: answers.role,
                manager_id: answers.manager
            })
            return created
        })
    }
}