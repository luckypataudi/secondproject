const mysql = require('mysql');
const dotenv = require('dotenv');
const { response } = require('express');
let instance = null;
dotenv.config();

const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
    // port: process.env.DB_PORT

});

connection.connect((err) => {

    if (err) {
        console.log(err.message);
    }
    console.log('db ' + connection.state);
});

class DbService {
    static getDbServiceInstance() {
        return instance ? instance : new DbService();
    }

    async getAllData() {
        try {
            const response = await new Promise((resolve, reject) => {
                const query = "select * from crud_app ";

                connection.query(query, (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })

            });
            return response;
        } catch (error) {
            console.log(error);
        }



    }

    async insertNewName(name) {
        try {
            const dateAdded = new Date();
            const insertId = await new Promise((resolve, reject) => {

                const query = "insert into crud_app(name,datetime) values(?,?);";

                connection.query(query, [name, dateAdded], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.insertId);
                })
            });
            return {
                id: insertId,
                name: name,
                dateAdded: dateAdded
            };

        } catch (err) {
            console.log(err);
        }
    }
    async deleteRowById(id) {

        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {

                const query = "delete from crud_app where id = ? ";

                connection.query(query, [id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result.affectedRows);
                })
            });

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }


    }
    async updateNameById(id, name) {

        try {
            id = parseInt(id, 10);
            const response = await new Promise((resolve, reject) => {
                const query = "update crud_app set name = ? where id = ? ";
                connection.query(query, [name, id], (err, result) => {
                    if (err) reject(new Error(err.message));
                    resolve(result);
                })
            });

            return response === 1 ? true : false;

        } catch (error) {
            console.log(error);
            return false;
        }


    }
    async searchByName(name) {

        console.log(name);
        try {
            const response = await new Promise((resolve, reject) => {
                if(name == 'All'){
                    const query = "select * from crud_app";
                    connection.query(query,(err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    })
                }else{
                    const query = "select * from crud_app where name = ? ";
                    connection.query(query, [name],(err, result) => {
                        if (err) reject(new Error(err.message));
                        resolve(result);
                    })
                }

               

            });
            return response;
        } catch (error) {
            console.log(error);
        }


    }
}

module.exports = DbService;