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


module.exports = {
    'getAllEmployees' : getAllEmployees,
    'getAllDepartments' : getAllDepartments,
    'getEmployeesByDept' : getEmployeesByDept,
    'closeConnection' : close
}