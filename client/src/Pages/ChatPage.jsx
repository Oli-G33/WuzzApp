import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../Components/miscellaneous/SideDrawer';
import MyChats from '../Components/miscellaneous/MyChats';
import ChatBox from '../Components/miscellaneous/ChatBox';

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div style={{ width: '100%' }}>
      {user && <SideDrawer />}

      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};

export default ChatPage;
