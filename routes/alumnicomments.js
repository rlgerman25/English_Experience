const express = require("express");
const router = express.Router();
const Alumn = require("../models/alumnSchema.js");
const Comment = require("../models/comments.js");
const middleware = require("../middleware");


// ===============================
//Alumni Comment Routes
//FIND COMMENTS BY ID
router.get("/alumni/:id/comment/new", middleware.isLoggedIn, function(req, res) {
    //Find comment by id
    Alumn.findById(req.params.id, function(err, individualAlumn) {
        if (err) {
            console.log(err);
        } else {
            res.render("alumniComments/new.ejs", { individualAlumn: individualAlumn });
        }
    })
});
//CREATE NEW COMMENT USING ID
router.post("/alumni/:id/comment", middleware.isLoggedIn, function(req, res) {
    //lookup question using ID
    Alumn.findById(req.params.id, function(err, alumnComment) {
        if (err) {
            console.log(err);
            res.redirect("/alumni");
        } else {
            //Create new question
            Comment.create(req.body.comment, function(err, createdComment) {
                    if (err) {
                        console.log(err);
                    } else {
                        //add username question and id to comment
                        createdComment.author.id = req.user._id;
                        createdComment.author.username = req.user.username;
                        //save comment
                        createdComment.save();
                        alumnComment.comments.push(createdComment);
                        alumnComment.save();
                        res.redirect("/alumni/" + alumnComment._id)
                    }
                })
                //connect new comment to question
                //redirect
        }
    });
});

router.get("/alumni/:id/comment/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, alumniFoundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("alumniComments/commentEdit.ejs", { alumni_id: req.params.id, alumniComment: alumniFoundComment });
        }
    });
});

router.put("/alumni/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/alumni/" + req.params.id);
        }
    });
});



module.exports = router;