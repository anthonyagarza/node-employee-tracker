const mysql = require('mysql')

connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'test',
    password : 'test',
    database : 'seed'
});

connection.connect(function(err) {
    if (err) {
        throw ('error connecting: ' + err.stack);
    }

    console.log('connected as id ' + connection.threadId);
});

function close() {
    connection.end();
}

/**
 * Promisifies the mysql query function so we don't have to use callbacks
 */
function promiseQuery(query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

function promiseInsert(sql, data) {
    return new Promise((resolve, reject) => {
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

/**
 * Get all Departments
 */
async function getAllDepartments() {
    return await promiseQuery('SELECT id, name FROM department')
}

/**
 * Gets all the Employees
 * Joins tables to get Department and Role data
 */
async function getAllEmployees(extra) {
    return await promiseQuery(`SELECT 
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name, 
        r.salary, 
        CONCAT(em.first_name, " ", em.last_name) as manager 
        FROM employee e JOIN role r ON e.role_id = r.id 
            JOIN department d ON r.department_id = d.id 
            LEFT JOIN employee em ON e.manager_id = em.id 
        ORDER BY e.last_name, e.first_name`)
}

async function getAllManagers() {
    return await promiseQuery(`
        SELECT em.*
        FROM employee e JOIN employee em ON e.manager_id = em.id
    `)
}

async function getEmployeesByDept(deptName) {
    return await promiseQuery(`
        SELECT
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name, 
        r.salary, 
        CONCAT(em.first_name, " ", em.last_name) as manager 
        FROM employee e JOIN role r ON e.role_id = r.id 
            JOIN department d ON r.department_id = d.id 
            LEFT JOIN employee em ON e.manager_id = em.id 
        WHERE d.name = '${deptName}'
        ORDER BY e.last_name, e.first_name
    `)
}

async function getEmployeesByManager(managerId) {
    return await promiseQuery(`
        SELECT
        e.id, 
        e.first_name, 
        e.last_name, 
        r.title, 
        d.name, 
        r.salary, 
        CONCAT(em.first_name, " ", em.last_name) as manager 
        FROM employee e JOIN role r ON e.role_id = r.id 
            JOIN department d ON r.department_id = d.id 
            LEFT JOIN employee em ON e.manager_id = em.id 
        WHERE e.manager_id = '${managerId}'
        ORDER BY e.last_name, e.first_name
    `)
}

async function getAllRoles() {
    return await promiseQuery(`
        SELECT * FROM role
    `)
}

async function createEmployee(employee) {
    let result = await promiseInsert('INSERT INTO employee SET ?', employee)
    employee.id = result.insertId
    return employee
}

async function removeEmployee(id) {
    await promiseQuery(`DELETE FROM employee WHERE id = ${id}`)
}

async function updateEmployeeRole(id, roleId) {
    return new Promise((resolve, reject) => {
        connection.query(`
            UPDATE employee SET role_id = ? WHERE id = ?
        `, [roleId, id], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}

async function updateEmployeeManager(id, managerId) {
    return new Promise((resolve, reject) => {
        connection.query(`
            UPDATE employee SET manager_id = ? WHERE id = ?
        `, [managerId, id], (error, results, fields) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    })
}


module.exports = {
    'query' : async (sql) => {
        return await promiseQuery(sql)
    },
    'getAllEmployees' : getAllEmployees,
    'getAllManagers' : getAllManagers,
    'getAllDepartments' : getAllDepartments,
    'getEmployeesByDept' : getEmployeesByDept,
    'getEmployeesByManager' : getEmployeesByManager,
    'getAllRoles' : getAllRoles,
    'createEmployee' : createEmployee,
    'removeEmployee' : removeEmployee,
    'updateEmployeeRole' : updateEmployeeRole,
    'updateEmployeeManager' : updateEmployeeManager,
    'closeConnection' : close
}