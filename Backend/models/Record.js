const mongoose = require('mongoose');;

const recordSchema = new mongoose.Schema({  
    amount:{
        type : Number,
        required : [true,'Amount is required']
    },
    type:{
        type : String,
        enum : ['income','expense'],
        required : [true,'Type must be either income or expense']
    },
    category:{
        type : String,
        enum : ['Salary','Investment','Food','Entertainment','Utilities','Other'],
        required : [true,'Category is required']
    },
    date:{
        type : Date,
        required : [true,'Date is required'],
        default : Date.now
    },
    notes:{
        type : String,
        trim : true,
        maxlength : [500,'Notes cannot exceed 500 characters']
    },
    createdBy : {
        type : mongoose.Schema.Types.ObjectId,  
        ref : 'User',
        required : true
    }
}
,{timestamps:true});

const Record = mongoose.model('Record',recordSchema);
module.exports = Record;


