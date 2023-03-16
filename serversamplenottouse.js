const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'books_db'
  },
  console.log(`Connected to the books_db database.`)
);


db.query('SELECT COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, results) {
  console.log(results);
});

db.query('SELECT * FROM favorite_books', function (err, results) {
  console.log(results);
});

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
showDepartments = () => {
  console.log('Showing all departments...\n');

  const sql = `SELECT department.id AS id, department.name AS department FROM department`; 

  connection.promise().query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
     promptUser();
  });
};


showDepartments = () => {
  console.log('Showing all departments...\n');

  const sql = `SELECT department.id AS id, department.name AS department FROM department`; 

  connection.promise().query(sql)
      .then((data) => { 
    if (err) throw err;
    console.table(rows);
     promptUser();
      }).cach(error =>{
        throw error;
      }
        )
  
};


const addRole = () => {
  console.log('Adding role..\n'); 
  const departmentSql = "SELECT name , id as value from department"

  const roleSql = "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)"


}

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
              
              console.log("Department  added. \n");
              promptUser();
          })
  });
};
