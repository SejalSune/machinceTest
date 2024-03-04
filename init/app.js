const mongoose = require('mongoose');
const initdata=require("./data.js");
const employee=require("../models/employee.js");

main()
.then(()=>console.log("DB Connected"))
.catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/company');
}

const initDB= async ()=>{
    await employee.deleteMany({});
    let sample=await employee.insertMany(initdata.data);
    console.log(sample);
};

initDB();