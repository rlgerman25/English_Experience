var mongoose    = require("mongoose"),
    NewBook     = require("./models/newBook.js"), 
    Comment     = require("./models/comments");
 
var bookList = [
    {
        bookName: "Jonathan Livingston Seagull", 
        bookAuthor: "Richard Bach",
        bookImage: "https://is3-ssl.mzstatic.com/image/thumb/Video128/v4/e8/0b/3e/e80b3ed2-cd9a-d5a3-d582-9b14aec7168b/pr_source.jpg/268x0w.jpg",
        bookFavoritePart: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        bookName: "Twilight", 
        bookAuthor: "Stephanie Meyer",
        bookImage: "https://images-na.ssl-images-amazon.com/images/I/41K99%2BcInvL._SX326_BO1,204,203,200_.jpg",
        bookFavoritePart: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {
        bookName: "The Four Agreements", 
        bookAuthor: "Don Miguel Ruiz",
        bookImage: "https://images-na.ssl-images-amazon.com/images/I/91Rp%2By1ePrL.jpg",
        bookFavoritePart: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
]
 
function seedDB(){
  //Remove all alumni and comments
  NewBook.deleteMany({}, function(err){
    if(err){
        console.log(err);
    }
    console.log("Removed alle Buuche!");
    Comment.deleteMany({}, function(err) {
        if(err){
            console.log(err);
        }
        console.log("removed comments!");
         //add a few alumns
        bookList.forEach(function(seed){
            NewBook.create(seed, function(err, newbyBook){
                if(err){
                    console.log(err);
                } else {
                    console.log("A new book is ready to be sold ;)");
                    //create a comment
                    Comment.create(
                        {
                            text: "A new book to read",
                            author: "Diana"
                        }, function(err, comment){
                            if(err){
                                console.log(err);
                            } else {
                                newbyBook.comments.push(comment);
                                newbyBook.save();
                                console.log("Excuse me?... I think someone said something");
                            }
                        });
                }
            });
        });
    });
 });  
}
 
module.exports = seedDB;