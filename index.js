const mongoose = require('mongoose');
const express=require("express");
const app=express();
const port=8080;
const methodOverride=require("method-override");
const path=require("path");
const employee=require("./models/employee.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const sessionOptions={
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { 
      expires:Date.now()+7*1000*60*60*24,
      maxAge:7*1000*60*60*24,
      httpOnly:true,
     }
  }

app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"/public")));
app.set("views",path.join(__dirname,"views"));

app.use(flash());
app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});  

main()
.then(()=>console.log("DB Connected"))
.catch(err => console.log(err));


//form
app.get("/employee/new",(req,res)=>{
    res.render("form.ejs");
});

app.post("/employee/new", async(req,res)=>{
    let employeefield=req.body.company;
    let newemployee=new employee(employeefield);
    await newemployee.save();
    res.redirect("/employee/details");
});

//details
app.get("/employee/details",async(req,res)=>{
    const allemployees=await employee.find({});
    res.render("show.ejs",{allemployees});
});

//edit
app.get("/employee/:id", async (req,res)=>{
    let {id}=req.params;
    let employeeedit=await employee.findById(id);
    res.render("edit.ejs",{employeeedit});
});

app.delete("/employee/:id", async(req,res)=>{
    let {id}=req.params;
    let employeedelete=await employee.findByIdAndDelete(id);
    console.log(employeedelete);
    res.redirect("/employee/details");
});

//user
//signup
app.get("/start",(req,res)=>{
    res.render("start.ejs");
});

app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
});

app.post("/signup",async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        let newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser, (error)=> {
            if(error){
                return next(error);
            }
            req.flash("success","Welcome to Travel Thrill");
            res.redirect("/start");
        })
    } catch(e){
        req.flash("error",e.message);
        res.redirect("/start");
    }
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.post("/login",async (req, res) => {
    res.redirect("/employee/details");
});

app.delete("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err) {
            return next(err);
        }
        req.flash("success","You are Logout");
        res.redirect("/employee/details");
    });
});

app.listen(port,(req,res)=>{
    console.log("listening to port 8080");
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/company');
}