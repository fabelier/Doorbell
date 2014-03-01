// Init Express Framework
var express = require("express");
var fs = require("fs");
var mustache = require("mustache");
mustache.escape = function(string){return string;};
var config = getConfig();
var app = express();
var port = config.node_port;
var url = config.url + ":" + (config.reverse_proxy ? config.reverse_proxy_port : port);

function getConfig(){
  if (!fs.existsSync("config.js")) {
    synchronousCopy("config.js.template", "config.js");
    console.log("Copying default config file. You may want to adapt config.js");
  }

  var exhaustiveConfig = require("./config.js.template");
  var personalConfig = require("./config.js");
  return mergeJSON(exhaustiveConfig, personalConfig);
}

function synchronousCopy(srcFile, destFile){
  var BUF_LENGTH, buff, bytesRead, fdr, fdw, pos;
  BUF_LENGTH = 64 * 1024;
  buff = new Buffer(BUF_LENGTH);
  fdr = fs.openSync(srcFile, "r");
  fdw = fs.openSync(destFile, "w");
  bytesRead = 1;
  pos = 0;
  while (bytesRead > 0) {
    bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
    fs.writeSync(fdw, buff, 0, bytesRead);
    pos += bytesRead;
  }
  fs.closeSync(fdr);
  return fs.closeSync(fdw);
}

// == Routing request ==
// / is the ringbell URL
app.get("/", function(req, res){
    sendTemplatedFile(req, res, "ring.html");
});

// /monitor is for the host
app.get("/monitor", function(req, res){
    sendTemplatedFile(req, res, "monitor.html");
});

app.get("/qr", function(req, res){
    var password = req.query.password;
    log("A QR code has been scanned. Password is " + password);
    var state = tryToRing(null, password) ? "Success" : "Failed. Password may have changed";
    sendTemplatedFile(req, res, "ring.html", {source_qrcode: true, qr_state: state});
});

function sendTemplatedFile(req, res, filename, optionalJson){
    fs.readFile(filename, function(err, data){
       res.set('Content-Type', 'text/html');
       if (err) res.send(err);
       res.send(mustache.render(data.toString(), mergeJSON({url: url, logo_url: config.logo_url, password: config.use_password, config.place_name: config.place_name}, optionalJson)));
    });
}

function mergeJSON(overridedJson, overridingJson){
  if ( !defined(overridedJson) && !defined(overridingJson) ){
    return {};
  }
  if ( !defined(overridedJson) ){
    return overridingJson;
  }
  if ( !defined(overridingJson) ){
    return overridedJson;
  }
  return JSON.parse((JSON.stringify(overridedJson) + JSON.stringify(overridingJson)).replace(/}{/g,","));
}

function defined(obj){
  return typeof obj  !== 'undefined' && obj;
}

// Static files in /public
app.use(express.static(__dirname + '/public'));
// == end of routing ==

// Socket.io init
var io = require('socket.io').listen(app.listen(port));
log("Listening on port " + port, true);

// Socket.io config
io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging

io.set('transports', [
//    'websocket' // I use Apache with mod proxy. Websocket will fail.
  'htmlfile',
  'xhr-polling',
  'jsonp-polling'
]);
// End of config

// When socket is established
io.sockets.on('connection', function (socket) {
    // Wait for 'type' request (host or visitor)
    socket.on('type', function (data) {
        log("A " + data.type + " joined");
        socket.join(data.type); // join the room 'host' or 'visitor'
        
        // Only 'host' have message area
        if(data.type === 'host')
           socket.emit('message', { message: 'Welcome, Fabelier =)' });
    });

    // When someone press 'ring' button
    socket.on('ring', function (data, fn) {
        tryToRing(socket, data.password);
    });

    socket.on('ack', function(data, fn) {
        log("Host is acknowledging");
        if ( !data.message ){
          data.message = "Coming!";
        }
        sendTimestampedMessage('visitor', 'message', data.message);
    });
});

function tryToRing(socket, password){
  if ( ! verifiesPassword(password) ){
    log("Ring message doesn't validate the password");
    if ( socket ) { socket.emit('bad_password'); }
    return false;
  }
  log("Received ring message");

  // Send this message to hosts and tell visitors it's actually ringing
  sendTimestampedMessage('host', 'message', "Toc toc toc!!" );
  sendTimestampedMessage('visitor', 'ringing', "" );
  return true;
}

function verifiesPassword(password){
  if ( ! config.use_password ){
    return true;
  }

  return password && password === config.password.toString();
}

function sendTimestampedMessage(recipients, type, body){
  io.sockets.in(recipients).emit(type, {message: "[" + nowToString() + "]: " + body});
}

function log(message, forceVerbose){
  if (forceVerbose === true || config.verbose) {
    console.log(nowToString() + ": " + message);
  }
}

function nowToString(){
  var now = new Date();
  return "[" + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds() + "]";
}
