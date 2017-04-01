'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var apiai = require('apiai');
var appAI = apiai("f1d1c13188a14cccb13319f31d4cb0bb");
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/hook', function (req, res) {
	var context=req.body.result.contexts.getElementsByName("name")[0];
	var email = context.parameters.email;
  io.emit(email, req.body.result.fulfillment.messages[0].speech);
    console.log(req.body.result.fulfillment.messages[0].speech);
});


io.on('connection', function(socket){
  console.log('a user connected');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});
    
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});

io.on('connection', function(socket){
  socket.broadcast.emit('hi');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    var request = appAI.textRequest(msg, {
        sessionId: 'uid'
    });
    
    request.on('response', function(response) {
		var context=response.body.result.contexts.getElementsByName("name")[0];
		var email = context.parameters.email;
        io.emit(email, response.result.fulfillment.messages[0].speech);
        console.log(response.result.fulfillment.messages[0].speech);
    });
    
    request.on('error', function(error) {
        console.log(error);
    });
    
    request.end();
  });
});

http.listen(process.env.PORT, process.env.IP, function(){
  console.log('listening on *:'+process.env.PORT+':'+process.env.IP);
});
