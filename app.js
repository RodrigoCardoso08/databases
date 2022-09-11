const express = require ("express");
const app = express();
const mysql = require("mysql");

const pool = mysql.createPool({
    connectionLimit: 100, //important
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'estudos',
    debug: false
});

// add rows in the table
function addRow(data) {
    let insertQuery = 'INSERT INTO ?? (??,??, ??) VALUES (?,?,?)';
    let query = mysql.format(insertQuery,["aulas","aula","instrutor","dificuldade",data.aula,data.instrutor,data.dificuldade]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows added
        console.log(response.insertId);
    });
}

setTimeout(() => {
    // call the function
    addRow({
        "aula": "Testando inserção em tabelas",
        "instrutor": "RodrigoCardoso",
        "dificuldade": "1"
    });
},5000);

function queryRow(instrutorName) {
    let selectQuery = 'SELECT * FROM ?? WHERE ?? = ?';
    let query = mysql.format(selectQuery, ["aulas","instrutor",instrutorName]);
    pool.query(query,(err, data) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows fetch
        console.log(data);
    });
}

// setTimeout(() => {
//     // call the function
//     // select rows
//     queryRow('RodrigoCardoso');
// },5000);

//Muda o nome da aula de um usuário.
function updateRow(data) {
    let updateQuery = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
    let query = mysql.format(updateQuery,["aulas","aula",data.value,"user",data.user]);
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows updated
        console.log(response.affectedRows);
    });
}

function deleteRow(userName) {
    let deleteQuery = "DELETE from ?? where ?? = ?";
    let query = mysql.format(deleteQuery, ["aulas", "instrutor", userName]);
    // query = DELETE from `todo` where `user`='shahid';
    pool.query(query,(err, response) => {
        if(err) {
            console.error(err);
            return;
        }
        // rows deleted
        console.log(response.affectedRows);
    });
}

setTimeout(() => {
    // call the function
    // delete row
    deleteRow('shahid');
},5000);

app.get("/",(req,res) => {
    pool.getConnection((err, connection) => {
        if(err) throw err;
        console.log('connected as id ' + connection.threadId);
        connection.query('SELECT * from aulas', (err, rows) => {
            connection.release(); // return the connection to pool
            if(err) throw err;
            console.log('The data from users table are: \n', rows);
        });
    });
});

app.listen(3000, () => {
    console.log('Server is running at port 3000');
});