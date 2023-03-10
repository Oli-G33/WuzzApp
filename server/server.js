const express = require('express');
const connectDB = require('./config/db.js');
const dotenv = require('dotenv').config();
const { chats } = require('./data/data.js');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');
const cors = require('cors');

connectDB();
const app = express();
app.use(express.static('public'));
app.use(express.json());

app.use(
  cors({
    ...(process.env.CLIENT_APP_ORIGINS && {
      origin: process.env.CLIENT_APP_ORIGINS.split(',')
    }),
    credentials: true
  })
);

const PORT = process.env.PORT || 5000;

// app.get('/', (req, res) => {
//   res.send(`API is running successfully`);
// });

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/message', messageRoutes);

app.use(notFound);
app.use(errorHandler);

app.get('/api/chat', (req, res) => {
  res.send(chats);
});

app.get('/api/chat/:id', (req, res) => {
  //   console.log(req.params.id);
  const singleChat = chats.find(c => c._id === req.params.id);
  res.send(singleChat);
});

const server = app.listen(PORT, console.log(`Server started on PORT ${PORT}`));
const io = require('socket.io')(server, {
  pingTimeout: 60000,
  cors: { origin: 'https://wuzzapp1.netlify.app/' }
});

io.on('connection', socket => {
  console.log('Connected to socket.io');

  socket.on('setup', userData => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit('connected');
  });

  socket.on('join chat', room => {
    socket.join(room);
    console.log('User joined room: ' + room);
  });

  socket.on('new message', newMessageReceived => {
    let chat = newMessageReceived.chat;

    if (!chat.users) return console.log('chat.users is empty');

    chat.users.forEach(user => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit('message received', newMessageReceived);
    });
  });

  socket.on('typing', room => socket.in(room).emit('typing'));
  socket.on('stop typing', room => socket.in(room).emit('stop typing'));

  socket.off('setup', () => {
    console.log('USER DISCONNECTED');
    socket.leave(userData._id);
  });
});
