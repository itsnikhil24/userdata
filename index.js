const express = require('express');
const app = express();
const path = require('path');
const usermodel = require('./models/user');
const fs = require('fs');

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.get('/', function (req, res) {
    res.render("index.ejs");
});

app.get('/delete/:id', async function (req, res) {
    let todelete = await usermodel.findOneAndDelete({ _id: req.params.id });
    res.redirect('/user');
});

app.get('/edit/:id', async (req, res) => {
    let to_edit = await usermodel.findById(req.params.id);
    res.render('edit', { to_edit });
});

app.post('/update/:id', async (req, res) => {
    await usermodel.findOneAndUpdate(
        { _id: req.params.id },
        {
            names: req.body.names,
            email: req.body.email,
            password: req.body.password,
        },
        { new: true }
    );
    res.redirect("/user");
});

app.get('/user', async function (req, res) {
    let allusers = await usermodel.find();
    res.render("seeuser.ejs", { users: allusers });
});

app.post('/create', upload.single('image'), async function (req, res) {
    let createduser = await usermodel.create({
        names: req.body.names,
        email: req.body.email,
        password: req.body.password,
        img: {
            data: fs.readFileSync(path.join(__dirname, "/public/images", req.file.filename)),
            contentType: req.file.mimetype
        }
    });
    res.redirect('/user');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
