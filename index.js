// Init Express Framework
var express = require("express");
var app = express();
var port = 8081;

// == Routing request ==
// / is the ringbell URL
app.get("/", function(req, res){
    res.sendfile("ring.html");
});

// /monitor is for the host
app.get("/monitor", function(req, res){
    res.sendfile("monitor.html");
});

// Static files in /public
app.use(express.static(__dirname + '/public'));
// == end of routing ==

// Socket.io init
var io = require('socket.io').listen(app.listen(port));
console.log("Listening on port " + port);

// Socket.io config
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

io.set('transports', [
//    'websocket' // I use Apache with mod proxy. Websocket will fail.
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);
// End of config

// When socket is established
io.sockets.on('connection', function (socket) {
    // Wait for 'type' request (host or visitor)
    socket.on('type', function (data) {
        socket.join(data.type); // join the room 'host' or 'visitor'
        
        // Only 'host' have message area
        if(data.type == 'host')
           socket.emit('message', { message: 'Welcome, Fabelier =)' });
    });

    // When someone press 'ring' button
    socket.on('ring', function (data, fn) {
        // Send this message to hosts. Other visitor won't receive the message
        io.sockets.in('host').emit('message', { message: "Toc toc toc!!" });
    });
});

