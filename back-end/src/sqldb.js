var mysql = require('mysql2');
var instance=null;
var connection = mysql.createConnection({
    
    port: process.env.PORT,
    user: 'root',
    password: 'root',
    host:'localhost',
    database: 'mydb'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
    // var sql = "CREATE TABLE users(id int NOT NULL AUTO_INCREMENT,email VARCHAR(255),isVerified BOOLEAN,PRIMARY KEY (id),favoriteFood VARCHAR(255),hairColor VARCHAR(255),Bio VARCHAR(255))";
    // connection.query(sql, function (err, result) {
    //     if (err) throw err;
    //     console.log("Table created");
    // });
});

class DbService
{
    static getDbServiceInstance(){
        return instance ? instance  :  new DbService();
    }

    async saveSignUp(email,isVerified,favoriteFood,hairColor,Bio)
    {
        try{
            const response=await new Promise((resolve,reject)=>
            {
                const sql="INSERT INTO users(email,isVerified,favoriteFood,hairColor,Bio) VALUES (?,?,?,?,?);";
                connection.query(sql,[email,isVerified,favoriteFood,hairColor,Bio],(err,results)=>
                {
                    if(err) reject(new Error(err.message));
                    resolve(results)
                })
            });
            return response;
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async UpdateUser(email,isVerified)
    {
        try{
            const response=await new Promise((resolve,reject)=>
            {
                const sql="UPDATE users SET  isVerified= ? WHERE email = ?;";
                connection.query(sql,[isVerified,email],(err,results)=>
                {
                    if(err) reject(new Error(err.message));
                    resolve(results)
                })
            });
            return response;
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async findone(email)
    {
        try{
            const response=await new Promise((resolve,reject)=>
            {
                const sql="select * from users where email=?";
                connection.query(sql,[email],(err,results)=>
                {
                    if(err) reject(new Error(err.message));
                    resolve(results)
                })
            });
            return response;
        }
        catch(error)
        {
            console.log(error);
        }
    }

    async UpdateUserData(email,favoriteFood,hairColor,Bio)
    {
        try{
            const response=await new Promise((resolve,reject)=>
            {
                const sql="UPDATE users SET favoriteFood=?,hairColor=?,Bio=? where email=?;";
                connection.query(sql,[favoriteFood,hairColor,Bio,email],(err,results)=>
                {
                    if(err) reject(new Error(err.message));
                    resolve(results)
                })
            });
            console.log(response);
            return response;
        }
        catch(error)
        {
            console.log(error);
        }
    }
}

module.exports=DbService;