var express = require("express");
var router = express.Router();
const NewBook = require("../models/newBook.js");
const Comment = require("../models/comments.js");
const middleware = require("../middleware");


//FIND BOOK USING MONGO ID
router.get("/books/:id/comment/new", middleware.isLoggedIn, function(req, res) {
    //Find comment by id
    NewBook.findById(req.params.id, function(err, individualBook) {
        if (err) {
            console.log(err);
        } else {
            res.render("bookComments/new.ejs", { individualBook: individualBook });
        }
    });
});

//CREATE NEW USER COMMENT ONCE IT HAS BEEN FOUND
router.post("/books/:id/comment", middleware.isLoggedIn, function(req, res) {
    //lookup question using ID
    NewBook.findById(req.params.id, function(err, bookComment) {
        if (err) {
            console.log(err);
            res.redirect("/books");
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
                    //connect new comment to book
                    bookComment.comments.push(createdComment);
                    bookComment.save();
                    //redirect
                    res.redirect("/books/" + bookComment._id)
                }
            });
        }
    });
});
router.get("/books/:id/comment/:comment_id/edit", function(req, res) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("bookcomments/commentEdit.ejs", { book_id: req.params.id, bookComment: foundComment });
        }
    });
});

router.put("/books/:id/comment/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;