const   mongoose    = require ("mongoose"),
        Alumn       = require("./models/alumnSchema.js"),
        Comment     = require("./models/comments.js")

    var newAlumns = [
        {
            alumniName: "Harry Potter",
            alumniImage: "https://timedotcom.files.wordpress.com/2014/07/301386_full1.jpg",
            alumniDescription: "I am the main character"
        },
        {
            alumniName: "Hermione Granger",
            alumniImage: "https://i.pinimg.com/originals/69/b7/d9/69b7d94d8b8800a75b966824566f0c81.jpg",
            alumniDescription: "I am arguably the most beautiful woman on earth"
        },
        {
            alumniName: "Ronald Weasley",
            alumniImage: "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Ron_Weasley_poster.jpg/220px-Ron_Weasley_poster.jpg",
            alumniDescription: "I am a famous ginger guy"
        }
    ]

    function seedAlumn() {
      //Remove all alumni and comments
      Alumn.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed questions!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few alumns
            newAlumns.forEach(function(seed){
                Alumn.create(seed, function(err, newbyAlumn){
                    if(err){
                        console.log(err);
                    } else {
                        console.log("added a new Alumn ;)");
                        //create a comment
                        Comment.create(
                            {
                                text: "I am back B@$%^&",
                                author: "Lord Boldemort"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    newbyAlumn.comments.push(comment);
                                    newbyAlumn.save();
                                    console.log("Boldemort said something");
                                }
                            });
                    }
                });
            });
        });
    }); 

    }
    
    module.exports = seedAlumn;