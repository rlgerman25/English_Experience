const express = require("express");
const router = express.Router();
const QA = require("../models/qaSchema.js");
const middleware = require("../middleware");



//Q&A ROUTES
//FIND ALL QUESTIONS IN DATABASE
router.get("/q&a", function(req, res) {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        QA.find({ question: regex }, function(err, allQuestions) {
            if (err) {
                console.log(err);
            } else {
                if (allQuestions.length < 1) {
                    noMatch = "No question(s) match that query. Please try again.";
                }
                res.render("qas/questions_answers.ejs", { allQuestions: allQuestions, noMatch: noMatch })
            }
        });
    } else {
        //Get all questions from DB
        QA.find({}, function(err, allQuestions) {
            if (err) {
                console.log(err);
            } else {
                res.render("qas/questions_answers.ejs", { allQuestions: allQuestions, noMatch: noMatch })
            }
        });
    }
});

//CREATE NEW QUESTIONS
router.post("/q&a", middleware.isLoggedIn, function(req, res) {
    var question = req.body.question;
    var image = req.body.image;
    var url = req.body.url;
    //used to add author to my questions
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newQuestion = { question: question, image: image, url: url, author: author }
    QA.create(newQuestion, function(err, newlyCreatedQuestion) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/q&a");
        }
    });
});

//RENDER NEW QUESTION FORM
router.get("/q&a/new", middleware.isLoggedIn, function(req, res) {
    res.render("qas/qanew");
});

//FIND QUESTION(S) USING DATABASE AND ADD A COMMENT TO SUCH QUESTION
router.get("/q&a/:id", function(req, res) {
    QA.findById(req.params.id).populate("comments").exec(function(err, foundQuestion) {
        if (err) {
            console.log(err);
        } else {
            res.render("qas/qashow", { question: foundQuestion });
        }
    });
});

//EDIT QUESTION ROUTE
router.get("/q&a/:id/edit", middleware.checkQuestionOwnership, function(req, res) {
    QA.findById(req.params.id, function(err, foundQuestion) {
        res.render("qas/qaEdit", { question: foundQuestion });
    });
});

//UPDATE QUESTION ROUTE  - findOneAndUpdate
router.put("/q&a/:id", middleware.checkQuestionOwnership, function(req, res) {
    QA.findByIdAndUpdate(req.params.id, req.body.question, function(err, updatedQuestion) {
        if (err) {
            res.redirect("/q&a");
        } else {
            res.redirect("/q&a/" + req.params.id);
        }
    });
});

//DELETE A QUESTION
router.delete("/q&a/:id", middleware.checkQuestionOwnership, function(req, res) {
    QA.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/q&a");
        } else {
            res.redirect("/q&a");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;