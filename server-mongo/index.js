const express = require('express');
const dotenv = require("dotenv").config();
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const USERNAME = process.env.USERNAME_DB;
const PASSWORD = process.env.PASSWORD_DB;
const DB_NAME = process.env.DB_NAME;

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended:true}));

// Database
mongoose.connect(
    `mongodb+srv://${USERNAME}:${PASSWORD}@todo.axhmmzb.mongodb.net/${DB_NAME}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
);

const db = mongoose.connection
db.on('error', (error) => console.error(error));
db.once('error', () => console.error("Connected to the database."));

// Routes
const accountsRouter = require('./routes/tbl_accounts')
app.use("/accounts", accountsRouter);

const todosRouter = require('./routes/tbl_todos')
app.use("/todos", todosRouter);


app.listen(3003, () =>{
    console.log("Server running in port 3003");
});

