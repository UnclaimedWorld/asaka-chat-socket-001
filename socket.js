const { Server } = require('ws');
const express = require('express');

const PORT = process.env.PORT || 3000;

const server = express().listen(PORT)

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
let messages = [
  {
    id: 1,
    user_id: users_list[0].id,
    message: 'Hello! Finally found the time to write to you) I need your help in creating interactive animations for my mobile application.',
    created_at: new Date(2021, 12, 22)
  },
  {
    id: 2,
    user_id: users_list[0].id,
    message: 'Can I send you files?',
    created_at: new Date(2021, 12, 22)
  },
  {
    id: 3,
    user_id: users_list[1].id,
    message: 'Hey! Okay, send out.',
    created_at: new Date(),
    is_read: true
  },
];

const wss = new Server({ server });

function sendData(ws, data) {
  ws.send(JSON.stringify(data));
}

function imitateOtherUser(ws) {
  setTimeout(() => {
    messages = messages.map(message => ({
      ...message,
      is_read: true
    }));
    sendData(ws, { messages });
    setTimeout(() => {
      messages.push({
        id: messages[messages.length - 1].id + 1,
        user_id: users_list[0].id,
        message: 'Let\'s imagine it\'s an answer from the other person.',
        created_at: new Date(),
        is_read: true
      });
      sendData(ws, { messages });
    }, 1000);
  }, 320);
}

wss.on('connection', function(ws) {
  ws.on('message', function(message) {
    messages.push({
      id: messages[messages.length - 1].id + 1,
      user_id: users_list[1].id,
      message: message.toString(),
      created_at: new Date(),
      is_read: false
    });
    sendData(ws, { messages });

    imitateOtherUser(ws);
  });

  ws.on('close', function() {
    console.log('close');
  });
  sendData(ws, { messages, users_list });
});