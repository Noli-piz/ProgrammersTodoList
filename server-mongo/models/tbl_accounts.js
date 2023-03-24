const mongoose = require('mongoose');
const AccountSchema = new mongoose.Schema({
    username:{
        type: String,
        required : true,
        unique : true
    },
    
    fullname:{
        type: String,
        required: false,
    },
    
    email:{
        type: String,
        required: false,
    },
    
    password:{
        type: String,
        required:true,
    },
    
});

module.exports =  mongoose.model('tbl_accounts', AccountSchema);