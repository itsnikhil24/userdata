const express =require('express');
const app=express();
const path=require('path');
const usermodel=require('./models/user')

app.set("view engine","ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));




app.get('/',function (req,res) {
    res.render("index.ejs");
    
})
app.get('/delete/:id',async function (req,res) {
    let todelete= await usermodel.findOneAndDelete({_id: req.params.id});
    res.redirect('/user');
})
app.get('/edit/:id',async function (req,res) {
    let to_edit= await usermodel.find ({_id: req.params.id});
    res.render('edit.ejs',{to_edit});
})
app.get('/user',async function (req,res) {
    let allusers= await usermodel.find();
    console.log(allusers);
    res.render("seeuser.ejs",{users:allusers});
    
})

app.post('/create',async function (req,res) {
    // let {name,email,password}=req.body;
    let createduser=await usermodel.create(
        {
             names:req.body.names,
             email:req.body.email,
             password:req.body.password,
            
        }
)

    res.redirect('/user');
})


app.listen(3000);