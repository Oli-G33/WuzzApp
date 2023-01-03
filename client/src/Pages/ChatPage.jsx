import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
  const [chats, setChats] = useState();

  const fetchChats = async () => {
    const data = await axios.get('http://localhost:5000/api/chat');

    setChats(data.data);
  };

  console.log(chats);

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {console.log(chats)}
      {/* {chats.map(chat => (
        <div>{chat.chatName}</div>
      ))} */}
      <h1>Chats</h1>
    </div>
  );
};

export default ChatPage;
