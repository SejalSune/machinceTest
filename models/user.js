const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Userschema = new mongoose.Schema({
    email:{
        type: String,
     },
});

Userschema.plugin(passportLocalMongoose);
module.exports=mongoose.model("User",Userschema);
