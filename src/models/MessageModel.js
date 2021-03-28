const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/Chatbox")
const Schema=mongoose.Schema;
const MessageSchema=new Schema({
    from:String,
    to:String,
    message:String,
    readstatus:{type:String,default:"unread"},
    image:String,
    grpid:String,
    fwdstatus:{type:Boolean,default:false},
    date:{ type : Date, default: Date.now }
   })

MessageData=mongoose.model("Message",MessageSchema);
module.exports=MessageData;