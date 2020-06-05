const express = require("express");
const router = express.Router();
const NewBook = require("../models/newBook.js");
const middleware = require("../middleware");

//BOOK SELLING/EXCHANGING ROUTES

//CREATE A NEW BOOK
router.get("/books", function(req, res) {
    var noMatch = null;
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        NewBook.find({ bookName: regex }, function(err, newlyCreatedBook) {
            if (err) {
                console.log(err);
            } else {
                if (newlyCreatedBook.length < 1) {
                    noMatch = "No book matches that query. Please try again.";
                }
                res.render("books/books", { bookList: newlyCreatedBook, noMatch: noMatch })
            }
        });
    } else {
        NewBook.find({}, function(err, newlyCreatedBook) {
            if (err) {
                console.log(err);
            } else {
                res.render("books/books", { bookList: newlyCreatedBook, noMatch: noMatch });
            }
        });
    }
});
//CREATE A NEW BOOK
router.post("/books", middleware.isLoggedIn, function(req, res) {
    var bookName = req.body.bookName;
    var bookAuthor = req.body.bookAuthor;
    var bookImage = req.body.bookImage;
    var bookFavoritePart = req.body.bookFavoritePart;
    var cost = req.body.cost;
    var sellDescription = req.body.sellDescription;
    //used to add author to my book posts
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newBook = { bookName: bookName, bookAuthor: bookAuthor, bookImage: bookImage, bookFavoritePart: bookFavoritePart, author: author, cost: cost, sellDescription: sellDescription }
    NewBook.create(newBook, function(err, newlyCreatedBook) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/books");
        }
    });
});
//RENDER BOOK FORM - HOW USERS CREATE NEW BOOKS
router.get("/books/new", middleware.isLoggedIn, function(req, res) {
    res.render("books/bookNew");
});

//FIND NEW BOOK AND POPULATE USING THE ID
router.get("/books/:id", function(req, res) {
    NewBook.findById(req.params.id).populate("comments").exec(function(err, foundBook) {
        if (err) {
            console.log(err);
        } else {
            res.render("books/bookShow", { book: foundBook });
        }
    });
});

//RENDER THE EDIT ALUMNI FORM
router.get("/books/:id/edit", middleware.bookOwnership, function(req, res) {
    NewBook.findById(req.params.id, function(err, foundBook) {
        res.render("books/bookEdit", { editBook: foundBook });
    });
});

//UPDATE BOOK ROUTE  - findOneAndUpdate
router.put("/books/:id", middleware.bookOwnership, function(req, res) {
    var newData = { bookName: req.body.bookName, bookAuthor: req.body.bookAuthor, bookImage: req.body.bookImage, bookFavoritePart: req.body.bookFavoritePart, cost: req.body.cost, sellDescription: req.body.sellDescription };
    NewBook.findByIdAndUpdate(req.params.id, req.body.book, { $set: newData }, function(err, updatedBook) {
        if (err) {
            res.redirect("/books");
        } else {
            req.flash("success", "Successfully Updated!");
            res.redirect("/books/" + req.params.id);
        }
    });
});

//DELETE BOOKS
router.delete("/books/:id", middleware.bookOwnership, function(req, res) {
    NewBook.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            res.redirect("/books");
        } else {
            res.redirect("/books");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;