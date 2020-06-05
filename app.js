const bodyParser = require("body-parser"),
    express = require("express"),
    mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    LocalStratery = require("passport-local"),
    methodOverride = require("method-override"),
    path = require("path"),
    ejs = require("ejs"),
    QA = require("./models/qaSchema.js"),
    Comment = require("./models/comments.js"),
    User = require("./models/user"),
    Alumn = require("./models/alumnSchema.js"),
    NewBook = require("./models/newBook.js"),
    qaseedDB = require("./seedsQA"),
    seedAlumn = require("./seedAlumn"),
    seedDB = require("./seedBook");

// ROUTE FILES
const qasRoutes = require("./routes/qas.js"),
    qaCommentRoutes = require("./routes/qacomments.js"),
    alumniRoutes = require("./routes/alumni.js"),
    alumniCommentRoutes = require("./routes/alumnicomments.js"),
    booksRoutes = require("./routes/books.js"),
    bookCommentsRoutes = require("./routes/bookcomments.js"),
    indexRoutes = require("./routes/index.js");

//seedDB();		
//qaseedDB(); // This is how to seed the QA database
//seedAlumn();  // Code to seed the Alumni database
const app = express();
const port = 3000;


mongoose.connect("mongodb://localhost/english_experience_v4", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//Deprecation Warnings for Mongoose
mongoose.set('useFindAndModify', false);
//Set a folder for styles and js extensions
app.use(express.static(__dirname + "/public"));
//app.use('/public', express.static('public'));
app.use(methodOverride("_method"));
//FLASH MESSAGES	
app.use(flash());
//INCLUDE DATES ON ALL POSTS
app.locals.moment = require("moment");

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I am the master of my faith, I am the captain of my soul",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratery(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//PASSING NAVBAR LOGIN MIDDLEWARE GLOBALLY
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


//TELLING THE APP TO USE THE ROUTES - LINKS TO THE ROUTES FILES
app.use(qasRoutes);
app.use(qaCommentRoutes);
app.use(alumniRoutes);
app.use(alumniCommentRoutes);
app.use(booksRoutes);
app.use(bookCommentsRoutes);
app.use(indexRoutes);





//DO NOT DELETE!
// // "/" => Folklore Timeline
// app.get("/folklore", function(req, res){
// 	res.sendFile("folkloreTimeline.ejs", {root: path.join(__dirname, "./views/")});
// });

console.log("****************");
app.listen(port, () => console.log("Server is runing..."));