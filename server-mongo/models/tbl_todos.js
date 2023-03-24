const mongoose = require('mongoose');
const TodoSchema = new mongoose.Schema({
    title:{
        type: String,
        required : true,
    },
    
    description:{
        type: String,
        required: false,
    },
    
    category:{
        type: String,
        required: false,
    },
    
    status:{
        type: String,
        required:true,
        default : 'task'
    },

    deleted:{
        type: Boolean,
        required:true,
        default : false
    },

    createdAt:{
        type: Date,
        required:true,
        default : Date.now
    },

    updatedAt:{
        type: Date,
        required:true,
        default : Date.now
    },

    id_account:{
        type: String,
        required:true
    }
});

module.exports =  mongoose.model('tbl_todos', TodoSchema);