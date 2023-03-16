// import mysql2
const mysql = require('mysql2')
// import inquirer 
const inquirer = require('inquirer'); 
// import console.table
const cTable = require('console.table'); 

require('dotenv').config()

// connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "root",
  database: 'employee_db'

});




connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId);
  afterConnection();
});

// function after connection is established and welcome image shows 
afterConnection = () => {
  console.log("***********************************")
  console.log("*                                 *")
  console.log("*        EMPLOYEE TRACKER         *")
  console.log("*                                 *")
  console.log("***********************************")
  promptUser();
};

// inquirer prompt for first action
const promptUser = () => {
  inquirer.prompt ([
    {
      type: 'list',
      name: 'choices', 
      message: 'What would you like to do?',
      choices: ['View all departments', 
                'View all roles', 
                'View all employees', 
                'Add a department', 
                'Add a role', 
                'Add an employee', 
                'Update an employee role',
                'Update an employee manager',
                "View employees by department",
                'Delete a department',
                'Delete a role',
                'Delete an employee',
                'View department budgets',
                'EXIT']
    }
  ])
    .then((answers) => {
      const { choices } = answers; 

      if (choices === "View all departments") {
        showDepartments();
      }

      if (choices === "View all roles") {
        showRoles();
      }

      if (choices === "View all employees") {
        showEmployees();
      }

      if (choices === "Add a department") {
        addDepartment();
      }

      if (choices === "Add a role") {
        addRole();
      }

      if (choices === "Add an employee") {
        addEmployee();
      }

      if (choices === "Update an employee role") {
        updateEmployee();
      }

      if (choices === "Update an employee manager") {
        updateManager();
      }

      if (choices === "View employees by department") {
        employeeDepartment();
      }

      if (choices === "Delete a department") {
        deleteDepartment();
      }

      if (choices === "Delete a role") {
        deleteRole();
      }

      if (choices === "Delete an employee") {
        deleteEmployee();
      }

      if (choices === "View department budgets") {
        viewBudget();
      }

      if (choices === "EXIT") {
        console.log("Have a good Day")
        connection.end()
    };
  });
};

// function to show all departments 
showDepartments = () => {
    console.log('Showing all departments...\n');
  
    const sql = `SELECT department.id AS id, department.name AS department FROM department`; 
  // Example for connection .query

    // connection.query(sql, (err, rows) => {
    //   if (err) throw err;
    //   console.table(rows);
    //    promptUser();
    //});

// Example for connection .promise().query
    connection.promise().query(sql).then(
          (rows) => {

        console.table(rows[0]);
         promptUser();
      });
  };
  
  

// function to show all roles 
showRoles = () => {
  console.log('Showing all roles...\n');

  const sql = `SELECT role.id, role.title, role.salary, department.name AS department
               FROM role
               INNER JOIN department ON role.department_id = department.id`;
  
  connection.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows); 
    promptUser();
  })
};

// function to show all employees 
showEmployees = () => {
  console.log('Showing all employees...\n'); 
  const sql = `SELECT employee.id, 
                      employee.first_name, 
                      employee.last_name, 
                      role.title, 
                      department.name AS department,
                      role.salary, 
                      CONCAT (manager.first_name, " ", manager.last_name) AS manager
               FROM employee
                      LEFT JOIN role ON employee.role_id = role.id
                      LEFT JOIN department ON role.department_id = department.id
                      LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.query(sql, (err, rows) => {
    if (err) throw err; 
    console.table(rows);
    promptUser();
  });
};


const addDepartment = () =>{
    console.log('Creating a new department..\n'); 
    const sql = "INSERT INTO department (name) VALUES (?) "
    inquirer.prompt ([
        {
          type: 'input',
          name: 'name', 
          message: 'What department do you want to create ?',
        }
    ])
    .then(({name}) => {

        
        connection.promise().query(sql,[name] ).then(
            (rows) => {
                
                console.log("Department " +  [name] + " added. \n");
                promptUser();
            })
    });
};

//Ads a role to the employee list

addRole = () => {
    inquirer.prompt([
      {
        type: 'input', 
        name: 'role',
        message: "What role do you want to add?",
        validate: addRole => {
          if (addRole) {
          return true;
          } else {
              console.log('Role can not be empty. Please enter a role');
              return false;
          }
        }
      },
      {
        type: 'input', 
        name: 'salary',
        message: "What is the salary of this role?",
        validate: addSalary => {
         
          if (addSalary) {
              return true;
          } else {
              console.log('Salary can not be empty. Please enter a salary');
              return false;
          }
        }
      }
    ])
      .then(answer => {
        const params = [answer.role, answer.salary];
  
        // grab dept from department table
        const roleSql = `SELECT name, id FROM department`; 
  
        connection.query(roleSql, (err, data) => {
          if (err) throw err; 
      
          const dept = data.map(({ name, id }) => ({ name: name, value: id }));
  
          inquirer.prompt([
          {
            type: 'list', 
            name: 'dept',
            message: "What department is this role in?",
            choices: dept
          }
          ])
            .then(deptChoice => {
              const dept = deptChoice.dept;
              params.push(dept);
  
              const sql = `INSERT INTO role (title, salary, department_id)
                          VALUES (?, ?, ?)`;
  
              connection.query(sql, params, (err, result) => {
                if (err) throw err;
                console.log('Added ' + answer.role + " to roles!"); 
  
                showRoles();
         });
       });
     });
   });
  };
  




  //  promptUser();