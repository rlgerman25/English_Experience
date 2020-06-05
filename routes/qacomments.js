const express = require("express");
const router = express.Router();
const QA = require("../models/qaSchema.js");
const Comment = require("../models/comments.js");
const middleware = require("../middleware");

// ===============================
//Comment Routes
//CREATE NEW COMMENT ON QUESTION - RENDER FORM FOR USER TO CREATE SUCH FORM
router.get("/q&a/:id/comment/new", middleware.isLoggedIn, function(req, res) {
    //Find comment by id
    QA.findById(req.params.id, function(err, question) {
        if (err) {
            console.log(err);
        } else {
            res.render("qascomments/new.ejs", { question: question });
        }
    })
});

//CREATE NEW COMMENTS AFTER FINDING INDIVIDUAL QUESTION BY ID
router.post("/q&a/:id/comment", middleware.isLoggedIn, function(req, res) {
    //lookup question using ID
    QA.findById(req.params.id, function(err, questionComment) {
        if (err) {
            console.log(err);
            res.redirect("/q&a");
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
                    //connect new comment to question
                    questionComment.comments.push(createdComment);
                    questionComment.save();
                    //redirect
                    res.redirect("/q&a/" + questionComment._id);
                }
            });
        }
    });
});

router.get("/q&a/:id/comment/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("qascomments/commentEdit.ejs", { question_id: req.params.id, qaComment: foundComment });
        }
    });
});

//UPDATE COMMENT ROUTE
router.put("/q&a/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/q&a/" + req.params.id);
        }
    });
});

//DELETE ROUTE - WHEN IT WORKS THAT IS...
router.delete("/q&a/:id/comment/:comment_id", middleware.checkCommentOwnership, function() {
    //Find By ID and Remove
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/q&a" + req.params.id);
        }
    });
});

module.exports = router;