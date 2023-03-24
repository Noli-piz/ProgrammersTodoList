const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {sign , verify} = require("jsonwebtoken");
const tbl_accounts = require( "../models/tbl_accounts");
const { validateToken } = require("../middlewares/AuthMiddlewares");


// Get All
router.get("/", validateToken , async (req, res) => {
    try{
        const data = await tbl_accounts.find();
        res.status(200).json(data);
    }catch(e){
        res.status(500).json({'error': e.message});
    }
});


// Get One
router.get("/username", async (req, res) => {
    try{
        const { username } = req.query;
        const data = await tbl_accounts.findOne({'username' : username});
        res.status(200).json("Account Exist!");
    }catch(e){
        res.status(500).json({'error': e.message});
    }
});

// Sign In
router.get("/signin", async (req, res) => {
    try{
        const username = req.query.username;
        const rawPassword = req.query.password;

        const data = await tbl_accounts.findOne({ 'username' : username}); //Check if username exist
        if(!data) return res.json( {error :  "No username exist!"}) 
        

        const match = await bcrypt.compare(rawPassword, data.password); //Check if password is equal
        if(match){
            const accessToken = sign( { username: data.username }, "importantsecret" );
            return res.json({success : "Login Success!", accessToken : accessToken});
        }

        return res.json({error : "Wrong password!"} );

    }catch(e){
        res.json({error : e.message});
    }
});

// Sign Up
router.post("/signup", async (req, res) => {
    try{
        const { username, fullname, email, password } = req.body;
        const data = await tbl_accounts.findOne({'username' : username}); // Check if username exist
        if(data) return res.status(200).json({error : "Username already exist!"})

        bcrypt.hash(password, 10, async function(err, hashPassword) {
            const newAccount = new tbl_accounts({ 'username' : username, 'fullname' : fullname, 'email' : email, 'password' : hashPassword});
            await newAccount.save();
            const accessToken = sign( { username: username }, "importantsecret" );
            return res.status(201).json({success : "Account has been successfully created!", accessToken : accessToken});
        });

    }catch(e){
        res.status(500).json({error: e.message});
    }
});


module.exports = router