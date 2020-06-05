const  express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");

// "/" => LANDING PAGE
router.get("/", function(req, res){
	res.render("index");
});


//RESOURCES ROUTES - TBD
router.get("/resources", function(req, res){
	res.render("resources");
});

//RENDER REGISTER/SIGN UP FORM FOR NEW USERS 
router.get("/register", function(req, res){
	req.flash("success", "No DiSPLAY");
	res.render("register");
});

//HANDLE SIGN UP LOGIC
router.post("/register", function(req, res){
	var newUser = new User({username:req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err) {
			console.log(err);
			return res.render("register", {error: err.message});
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Successfully Signed Up. Welcome to English Experience " + user.username + "!");
			res.redirect("/");
		});
	});
});

//AUTH ROUTES - LOGIN
router.get("/login", function(req, res) {
	res.render("login");
});

//LOGIN LOGIC
router.post("/login", passport.authenticate("local", 
	{	
		successRedirect: "/q&a",
		failureRedirect: "/login"
	}), function(req, res){
});

//LOGOUT
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out.");
	res.redirect("back");
});

//CATCH ALL ROUTE
router.get("*", function(req, res){
	res.redirect("/");
});

module.exports = router;

