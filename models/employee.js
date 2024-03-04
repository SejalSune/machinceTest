const mongoose = require('mongoose');
const express=require("express");

const employeeSchema=mongoose.Schema({
    name:String,
    email:String,
    mobileNo:Number,
    designation:String,
    gender:String,
    course:String,
    create_date:{
        type:String,
        default:Date,
    },
});

module.exports=mongoose.model("employee",employeeSchema);