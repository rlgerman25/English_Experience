const request = require('request');

request('https://dictionaryapi.com/api/v3/references/collegiate/json/programming?key=b8d137c0-749b-4d06-a4a0-8ea615e1902c', function(error, response, body) {
    console.log('error:', error); // Print the error if one occurred
    console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    let definitions = JSON.parse(body);
    let defSend = definitions[0]["shortdef"]; // Print the HTML for the Google homepage.
});