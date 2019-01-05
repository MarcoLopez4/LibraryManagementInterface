const fs = require('fs'); // Needed to write to the database
const app = require('express')(); 
const server = require('http').createServer(app); // The server
const io = require('socket.io')(server); // Create socket using the server
var libraryDatabase = require('./librarydatabase.json'); // The database itself

// Port used for server (connect by visiting "localhost:12345" in your browser when running this application on your host computer)
const port = 12345;

// Global variable used by security implementation (please see the warning)
var authenticatedIPs = [];

// Serve webpages
app.get('/', function(req, res, next) {

    // (Attempt at a) security implementation
    // Warning: This is a REALLY BAD security implementation; if ever used in production, please use a more secure solution.
    if(!authenticatedIPs.includes(req.connection.remoteAddress)){ // Is the person connecting authenticated?
        res.sendFile(__dirname + '/html/login.html'); // Client is not authenticated
    } else {
        res.sendFile(__dirname + '/html/managementinterface.html'); // Client is authenticated
    }

});

// Serve scripts
app.get('/js/:jsfile', function(req, res){ // Possible security issue: may be subject to path traversal? (I might be wrong)

    // Serves script corresponding to URL parameter
    // Example: "localhost:12345/js/login.js" will serve "/js/login.js"
    if(req.params.jsfile == "managementinterface.js"){ // The user wants to get the management interface script!
        if(authenticatedIPs.includes(req.connection.remoteAddress)){ // Just making sure they're authenticated first.
            res.sendFile(__dirname + '/js/' + req.params.jsfile); // Cool, they're authenticated; carry on.
        }else{
            res.sendStatus(401); // They're not authenticated, tell them they're unauthorized!
        }
    } else {
        res.sendFile(__dirname + '/js/' + req.params.jsfile);
    }

});

// socket.io logic (used to communicate between client and server)
io.on('connection', socket => { // Runs when a client connects to the socket.io server (which should automatically be done when the user's webpage is loaded)
    console.log(`User connected with IP ${socket.conn.remoteAddress}`);

    socket.on('authenticate', (data) => { // Client sent a request to authenticate!
        // Is password correct?
        if(data.password == "pleasedontdeductpointsforbadsecurity" && data.username == "admin"){ // The password should be hashed when used in production.
            socket.emit('authenticationresult', true); // Let the client know they're about to be authenticated.
            authenticatedIPs.push(socket.conn.remoteAddress); // Authenticate the client's IP.
            console.log(`${socket.conn.remoteAddress} has been authenticated.`); // Logging the IP to let the sysadmins make sure everything's alright
        }else{
            socket.emit('authenticationresult', false); // Login credentials are incorrect, let the client know it's wrong.
        }
    });

    // Client wants to get the database!
    socket.on('requestDatabase', () => {
        if(authenticatedIPs.includes(socket.conn.remoteAddress)){ // Just making sure they're authenticated first.
            socket.emit('databaseResponse', libraryDatabase); // Cool, they're authenticated; carry on.
        } else {
            socket.emit('databaseResponse', null); // They're not authenticated, sending them null.
        }
    });

    // Client wants to save their changes to the database!
    socket.on('requestSaveChanges', (data) => {
        if(authenticatedIPs.includes(socket.conn.remoteAddress)){ // Again, making sure they're authenticated first.
            socket.emit('saveChangesResponse', true); // Cool, they're authenticated; backup the database (so if anything goes wrong, it can get restored), then overwrite it.
            fs.writeFileSync("librarydatabase" + new Date().getTime() + ".json", JSON.stringify(libraryDatabase)); // Backing it up
            fs.writeFileSync("librarydatabase.json", JSON.stringify(data)); // Writing to the database
            libraryDatabase = JSON.parse(fs.readFileSync(__dirname + "/librarydatabase.json"));
        } else {
            socket.emit('saveChangesResponse', false); // They're not authenticated, let them know.
        }
    });
});

// Bind server to port and start listening
server.listen(port, () => console.log(`Listening on port ${port}`));