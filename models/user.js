const mongoose =require('mongoose');

mongoose.connect("mongodb://localhost:27017/testapp1");

const userschema=mongoose.Schema({
names:String,
email:String,
password:String,


})

module.exports=mongoose.model('user',userschema);