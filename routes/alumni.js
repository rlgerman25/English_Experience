const express = require("express");
const router = express.Router();
const Alumn = require("../models/alumnSchema.js");
const middleware = require("../middleware");



//ALUMNI CONNECTION ROUTES
//FIND ALUMN BY ID
router.get("/alumni", function(req, res) {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Alumn.find({ alumniName: regex }, function(err, allAlumni) {
            if (err) {
                console.log(err);
            } else {
                if (allAlumni.length < 1) {
                    noMatch = "No person matches that query. Please try again.";
                }
                res.render("alumni/alumni", { alumns: allAlumni, noMatch: noMatch })
            }
        });
    } else {
        Alumn.find({}, function(err, allAlumni) {
            if (err) {
                console.log(err);
            } else {
                res.render("alumni/alumni", { alumns: allAlumni, noMatch: noMatch });
            }
        });
    }
});

// POST NEW ALUMN
router.post("/alumni", middleware.isLoggedIn, function(req, res) {
    var alumniName = req.body.alumniName;
    var alumniImage = req.body.alumniImage;
    var alumniDescription = req.body.alumniDescription;
    //used to add author to my alumni posts
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newAlumn = { alumniName: alumniName, alumniImage: alumniImage, alumniDescription: alumniDescription, author: author }
        //Create new Alumn
    Alumn.create(newAlumn, function(err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            res.redirect("/alumni");
        }
    });
});

//RENDER FORM FOR USER TO CREATE ID
router.get("/alumni/new", middleware.isLoggedIn, function(req, res) {
    res.render("alumni/alumninew");
});

//POPULATE COMMENT - AND FIND BY ID
router.get("/alumni/:id", function(req, res) {
    Alumn.findById(req.params.id).populate("comments").exec(function(err, foundAlumn) {
        if (err) {
            console.log(err);
        } else {
            res.render("alumni/alumniShow", { alumn: foundAlumn });
        }
    });
});

//RENDER THE EDIT ALUMNI ROUTE
router.get("/alumni/:id/edit", middleware.alumnOwnership, function(req, res) {
    Alumn.findById(req.params.id, function(err, foundAlumn) {
        res.render("alumni/alumnEdit", { editAlumn: foundAlumn });
    });
});

//UPDATE ALUMNI ROUTE  - findOneAndUpdate
router.put("/alumni/:id", middleware.alumnOwnership, function(req, res) {
    Alumn.findByIdAndUpdate(req.params.id, req.body.alumn, function(err, updatedAlumn) {
        if (err) {
            res.redirect("/alumni");
        } else {
            res.redirect("/alumni/" + req.params.id);
        }
    });
});

//Remove Alumn - maybe if it works? 
router.delete("/alumni/:id", middleware.alumnOwnership, function(req, res) {
    Alumn.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/alumni");
        } else {
            res.redirect("/alumni");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;