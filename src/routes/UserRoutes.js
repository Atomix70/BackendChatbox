const express=require("express")
const router=express.Router()
const User=require("../models/UserModel")
const messages=require("../models/MessageModel")
const bcrypt=require("bcrypt")
var multer  = require('multer');
// Signup and login



router.post("/signup",(req,res)=>{
    // res.send("This is signup")
    var data={}
    // console.log(req.body)
    data=req.body;
    data.password=bcrypt.hashSync(data.password,10)    
    // console.log(data.email)
    // console.log(data.username)
    console.log(data)
    User.findOne({$or:[{email:data.email},{username:data.username}]},(err,docs)=>{
        if(err){
            console.log(err)
        }
        if(docs==null){           
            var CustomerData=User(data);
            CustomerData.save((err,data)=>{
                if(err){
                    console.log(err)
                }
                else
                {
                    res.status(200).send(data)
                }
            })
        }
        else
        {
            res.status(200).send({status:"exists"})
        }
        
    })
    

})

router.post("/login",(req,res)=>{
    // res.send("this is login")
    creds={}
     creds.email=req.body.email;
    console.log(creds)
    User.findOne(creds,(err,data)=>{
        console.log(data)
        // console.log(result)
        if(data){
            if(data=={})
        {        
                res.status(200).send({status:"invalid"})   
        }

            else if(bcrypt.compareSync(req.body.password,data.password)){
                res.status(200).send(data)
                console.log("data")
            }
            else{
                res.status(200).send({status:"invalid"})   
            }
        }
        else if(data==null){
            res.status(200).json({status:"invalid"})
        }
       
        if(err){
            console.log(err);
            res.send(err)
        }
    })    
    })

router.get("/alluser",(req,res)=>{

    User.find({},(err,data)=>{
        if(err){
            console.log(err)
        }
        if(data){
            res.send(data)
        }
    })
})

router.post("/block",(req,res)=>{
    // console.log(req)
    User.updateOne({username:req.body.username},{blockedlist:req.body.blockedlist},(err,data)=>{
        if(err){
            console.log(err)
        }
        if(data){
            console.log(data)
            res.status(200).send(data)
        }
    })
})


router.post("/mute",(req,res)=>{
    // console.log(req.username,req.mutedlist)

    User.updateOne({username:req.body.username},{mutedlist:req.body.mutedlist},(err,data)=>{
        if(err){
            console.log(err)
        }
        if(data){
            console.log(data)
            res.status(200).send(data)
        }
    })
})


router.post("/messages",(req,res)=>{
    username=req.body.username
    messages.find({
        $or: [
          { from: username },
          { to: username }
        ]
      },null, {sort: {date: -1}},(err,data)=>{
          if(err){
              console.log(err)
          }
          if(data)
          {res.status(200).send(data)}
      })
})




module.exports=router