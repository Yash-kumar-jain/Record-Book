const mongoose = require('mongoose')


const hisaabSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,           
        trim: true,     
        minlength: 3,        
        maxlength: 100           
    },
    description: {
        type: String,
        required: true,         
        trim: true               
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',              
    },
    editable: {
        type: Boolean,
        default: false,             
    },
    important: {
        type: Boolean,
        default: false,             
    },
    shareable: {
        type: Boolean,
        default: false         
    },
    encrypted: {
        type: Boolean,
        default: false          
    },
    passcode: {
        type: String,
        default:'',       
        trim: true},                

},
    {timestamps: true}
);
    


module.exports = mongoose.model('hisaab',hisaabSchema)



