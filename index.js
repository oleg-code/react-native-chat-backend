const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io')(server);
const port = 3000;
const mongoDB = "mongodb://localhost:27017/chat";
const mongoose = require('mongoose');
const Msg = require('./models/messages');

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('connected')
}).catch(err => console.log(err))

io.on("connection", socket => {
	Msg.find().then(result => {
        socket.emit('output-messages', result)
    })	
	console.log("a user connected :D");

	socket.on("chat message", msg => {
		const message = new Msg({ msg });
    	message.save().then(() => {  
    		console.log(msg);
    		io.emit("chat message", msg);
	})
  });
});

server.listen(port, () => console.log("server running on port:" + port));