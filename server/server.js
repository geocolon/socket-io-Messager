'use strict';
/* global socket, sendStatus */

const MongoClient = require('mongodb').MongoClient, assert = require('assert');
const client = require('socket.io').listen(4000).sockets;
// console.log('This is MongoClie nt in action...: ',MongoClient);
// Connect to mongo
MongoClient.connect('mongodb://localhost:27017/mongochat', {useNewUrlParser: true }, function(err, db) {
  assert.equal(null, err);
  if(err){
    throw err;
  }
  

  // Connect to Socket.io
  console.log('MongoDB ONLINE...');
  client.on('connection', function(socket){
    const chat = db.collection('chats');

    // Create function to send status
    let sendStatus = function(s){
      socket.emit('status', s);
    };

    chat.find().limit(100).sort({_id:1}).toArray(function(err, res){
      if(err) {
        throw err;
      }

      // emit the messages
      socket.emit('output', res);

      // Handle input events
      socket.on('input', function(date){
        let name = data.name;
        let message = data.message;

        // Check for name and message
        if(name === '' || message === '') {
        // Send error status
          sendStatus('Please enter a name and message');
        } else {
          // Insert message
          chat.insert({name : name, message: message}, function() {
            client.emit('output', [data]);

            // Send status object
            sendStatus({
              message: 'Message sent',
              clear: true
            });

          });
        }
      });

      // Handle clear
      socket.on('clear', function(data){
        console.log('Passing data: ',data);
        // Remove all chats from collection
        chat.remove({}, function(){
        // Emit cleared
          socket.emit('cleared');
        
        });
        
      });
    });
  });

  db.close();
});
