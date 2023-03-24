const express = require('express');
require("dotenv").config();
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const DATABASE = process.env.DATABASE;

app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({extended:true}));

// Database
mongoose.connect(
    DATABASE,
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

