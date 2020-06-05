const QA = require("../models/qaSchema.js"),
    Comment = require("../models/comments.js"),
    Alumn = require("../models/alumnSchema.js"),
    NewBook = require("../models/newBook.js"),

    //ALL THE MIDDLEWARE GOES HERE

    middlewareObj = {};

//MIDDLEWARE TO CHECK IF USER IS LOGGED IN
middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that.");
    res.redirect("/login");
}

//Q&A MIDDLWARE
middlewareObj.checkQuestionOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        QA.findById(req.params.id, function(err, foundQuestion) {
            if (err) {
                req.flash("error", "Question not found.");
                res.redirect("back");
            } else {
                //does user own what they wish to manipulate?
                if (foundQuestion.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

//MIDDLEWARE - CHECK IF COMMENT BELONGS TO USER
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                req.flash("error", "Comment not found.");
                res.redirect("back");
            } else {
                //does user own what they wish to manipulate?
                if (foundComment.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

//ALUMN MIDDLWARE
//MIDDLEWARE TO CHECK OWNERSHIP BY ID - THEN EDIT, DELETE, ETC.
middlewareObj.alumnOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Alumn.findById(req.params.id, function(err, foundAlumn) {
            if (err) {
                req.flash("error", "Person not found.");
                res.redirect("back");
            } else {
                //does user own what they wish to manipulate?
                if (foundAlumn.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

//BOOK MIDDLWARE
//MIDDLEWARE FOR ITEM/BOOK OWNERSHIP
middlewareObj.bookOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        NewBook.findById(req.params.id, function(err, foundBook) {
            if (err) {
                req.flash("error", "Book not found.");
                res.redirect("back");
            } else {
                //does user own what they wish to manipulate?
                if (foundBook.author.id.equals(req.user.id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in to do that.");
        res.redirect("back");
    }
}

module.exports = middlewareObj;