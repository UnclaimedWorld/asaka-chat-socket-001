const { Server } = require('ws');
const express = require('express');

const PORT = process.env.PORT || 3000;

const server = express().listen(PORT);

const users_list = [
  {
    id: 1234,
    name: 'Nika Jerrardo',
    last_online: new Date(),
    avatar_url: '/images/avatar-01.jpg',
  },
  {
    id: 3122,
    name: 'Me',
    last_online: new Date(),
    avatar_url: '/images/avatar-01.jpg',
  }
];
const clientsMessages = {};
let id = 0;

const wss = new Server({ server });

function sendData(ws, data) {
  ws.send(JSON.stringify(data));
}

function imitateOtherUser(ws, messages) {
  setTimeout(() => {
    messages.forEach(message => {
      message.is_read = true;
    });
    sendData(ws, { messages });
    setTimeout(() => {
      messages.push({
        id: id++,
        user_id: users_list[0].id,
        message: 'Let\'s imagine it\'s an answer from the other person.',
        created_at: new Date(),
        is_read: true
      });
      sendData(ws, { messages });
    }, 1000);
  }, 320);
}

wss.on('connection', function(ws, req) {
  let ip = req.socket.remoteAddress;
  clientsMessages[ip] = {
    messages: []
  }
  const messages = clientsMessages[ip].messages;
  ws.on('message', function(message) {
    messages.push({
      id: id++,
      user_id: users_list[1].id,
      message: message.toString(),
      created_at: new Date(),
      is_read: false
    });
    sendData(ws, { messages });

    imitateOtherUser(ws, messages);
  });
  sendData(ws, { users_list, messages });
});