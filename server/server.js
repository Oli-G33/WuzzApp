const express = require('express');
const connectDB = require('./config/db.js');
const dotenv = require('dotenv').config();
const { chats } = require('./data/data.js');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

connectDB();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`API is running successfully`);
});

app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);

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

app.listen(5000, console.log('Server started on PORT 5000'));
