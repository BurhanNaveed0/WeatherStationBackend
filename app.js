const mysql = require("mysql")
const express = require("express");
const { resourceLimits } = require("worker_threads");
const app = express()

const db = mysql.createConnection({
    host: "my-db.cleovrzmw7r9.us-east-2.rds.amazonaws.com",
    port: "3306",
    user: "admin",
    password: "Trim!57%",
    database: "temp_humidity_db"
});

db.connect((err) => {
    if (err) {
        console.log(err.message);
        return;
    }
    console.log("Connected to db...");
    
    db.query("CREATE TABLE IF NOT EXISTS data_table(Temp int, Humidity int, Time int)", (err, result) => {
        if (err) throw err;
        console.log("Data table created");
    });
});

app.listen(3000);
app.put("/data", (req, res) => {
    const temperature = req.query.temperature;
    const humidity = req.query.humidity;
    const time = Math.floor(Date.now() / 1000);

    db.query("INSERT INTO data_table VALUES (" + temperature + ", " + humidity + ", " + time + ")", (err, result) => {
        if (err) {
            res.statusCode = 400
            res.send("Data insertion failed");
            throw err;
        }

        console.log("Data insertion complete");
        res.statusCode = 200;
        res.send("Data insertion complete");
    });

})

app.get("/data", (req, res) => {
    
})