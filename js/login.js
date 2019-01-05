// Client-side javascript for the login page.

// Elements are set as variables for readability purposes.
var submitButton = document.getElementById("submitButton");
var usernameField = document.getElementById("usernameField");
var passwordField = document.getElementById("passwordField");

// Connect to the socket.io server
var socket = io.connect();
socket.on('connect', function(data){
    console.log("Connected to socket.io server"); // Logged for debugging purposes, the user shouldn't be able to see this (unless, of course, they open the console)
    
    socket.on('authenticationresult', function(isAuthenticated){ // We got a result after sending an authentication request!
        if(isAuthenticated){ // We've been authenticated!
            location.reload(); // Reload the page; if we've been properly authenticated, we should be directed to the management interface.
        } else { // Our credentials were incorrect...
            // Clear the fields
            usernameField.value = "";
            passwordField.value = "";

            alert("Your login credentials are incorrect."); // Let the user know their credentials are wrong.
        }
    });
});

submitButton.onclick = function(){ // Runs when the "Submit" button is clicked
    socket.emit('authenticate', { // Send a request to the server to authenticate
        username: usernameField.value,
        password: passwordField.value
    });
}