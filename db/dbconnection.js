const mongoose =require('mongoose')

mongoose.connect("mongodb+srv://lokendra:lokendra1@cluster0.xpravba.mongodb.net/node1?retryWrites=true&w=majority",{useUnifiedTopology:true},(err,res)=>{
    if(err){
        console.log('connection error',err);
    }
    else{
        console.log("db connected");
    }
})