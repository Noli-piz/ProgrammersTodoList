const express = require('express');
const router = express.Router();
const tbl_accounts = require( "../models/tbl_accounts");
const tbl_todos = require( "../models/tbl_todos");
const { validateToken } = require("../middlewares/AuthMiddlewares");


// Get Todo
router.get("/", validateToken , async (req, res) => {
    try{
        const { username } = req.query;
        const data = await tbl_accounts.findOne({'username' : username});
        const todoData = await tbl_todos.find({'id_account' : data.id, 'deleted' : false}).sort({'updatedAt' : 'asc'});
        res.status(200).json(todoData);
    }catch(e){
        res.status(200).json({'error': e.message});
    }
});

// Add Todo
router.post("/", validateToken ,async (req, res) => {
    try {
        const { username , title, description, category, status} = req.body;
        const data = await tbl_accounts.findOne({ 'username' : username}); //Check if username exist
        const todo = new tbl_todos({ 'id_account' : data.id , 'title' : title, 'description' : description, 'category' : category, 'status' : status});
        await todo.save(req.body);
        res.json('Success');
    }catch(e){
        res.json({ 'error' : e.message });
    }
});

// Update Status of Todo
router.post("/update", validateToken , async (req, res) => {
    try {
        const { id, status } = req.body;
        await tbl_todos.updateOne({ '_id' : id },{ 'status' : status, 'updatedAt' : Date.now() });
        res.json('Success');
    }catch(e){
        res.json({ 'error' : e.message });
    }
});

// Delete Todo
router.post("/delete", validateToken , async (req, res) => {
    try {
        const { id } = req.body;
        await tbl_todos.findOneAndUpdate({ '_id' : id },  { 'deleted' : true });
        res.json('Success');
    }catch(e){
        res.json({ 'error' : e.message });
    }
});


module.exports = router