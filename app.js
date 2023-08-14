const mysql = require("mysql")
const express = require("express");
const { createBrotliCompress } = require("zlib");
const app = express()
const port = 3000;

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

    db.query("CREATE TABLE IF NOT EXISTS data_table(Temp int, Humidity int, Time int, Room int)", (err, result) => {
        if (err) throw err;
        console.log("Data table created");
    });
});

app.put("/data", (req, res) => {
    const temperature = req.query.temperature;
    const humidity = req.query.humidity;
    const room = req.query.room;
    const time = Math.floor(Date.now() / 1000);

    res.setHeader("Content-Type", "text/html");

    db.query("INSERT INTO data_table VALUES (" + temperature + ", " + humidity + ", " + time + ", " + room + ")", (err, result) => {
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
    const roomId = req.query.roomId;
    res.setHeader("Content-Type", "application/json");

    const room_data = db.query("SELECT * FROM data_table WHERE room=" + roomId, (err, result) => {
        if (err) {
            res.statusCode = 400;
            res.setHeader("Content-Type", "text/html");
            res.send("Data insertion failed");
            throw err;
        }

        const room_data_table_json = JSON.stringify(result);
        console.log("Room data table sent --> " + room_data_table_json);
        res.statusCode = 200;
        res.send(room_data_table_json);
    });
})

app.get("/data/room", (req, res) => {
    const roomId = req.query.roomId;
    
    
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`);
});

