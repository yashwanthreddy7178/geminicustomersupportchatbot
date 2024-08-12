'use client'

import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [history, setHistory] = useState([]);
  const firstMessage = "Hi there! I'm the PlanetEarthAI virtual assistant. How can I help?";
  
  const [message, setMessage] = useState("");

  const sendMessage = async () => {
    setHistory((history) => [ ...history, {role: "user", parts: [{text: message}]} ]);
    setMessage('');

    const response = await fetch("/api/gemini", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify([ ...history, {role: "user", parts: [{text: message}]} ])
    });

    const data = await response.json();

    setHistory((history) => [ ...history, {role: "model", parts: [{text: data}] }]);
  };

  return (
    <Box
      width={'100vw'}
      height={'100vh'}
      display={'flex'}
      alignItems={'center'}
      justifyContent={'center'}
      p={2} // Padding around the whole container
    >
      <Stack 
        direction={'column'} 
        width={'50%'} 
        height={'80%'} 
        spacing={2} // Spacing between title and chat area
      >
        {/* Title Box */}
        <Box
          bgcolor={'primary.main'}
          color={'white'}
          p={2}
          borderRadius={5}
          textAlign='center'
        >
          <Typography variant='h6'>
            Chat with a PlanetEarthAI Information Bot
          </Typography>
        </Box>

        {/* Chat Container */}
        <Box
          width={'100%'}
          height={'100%'}
          border={'3px solid black'}
          borderRadius={5}
          display={'flex'}
          flexDirection={'column'}
        >
          <Stack 
            direction={'column'} 
            spacing={2} 
            overflow={'auto'} 
            p={2}
            flexGrow={1}
            // Make sure the chat container can scroll
            height={'calc(100% - 56px)'} // Adjust height to account for the input area
          >
            <Box
              display={'flex'}
              justifyContent={'flex-end'}
              bgcolor={'#32CD32'}
              borderRadius={10}
              p={2}
            >
              <Typography
                bgcolor={'#32CD32'}
                color={'white'}
              >
                {firstMessage}
              </Typography>
            </Box>
            {history.map((textObject, index) => (
              <Box
                key={index}
                display={'flex'}
                justifyContent={textObject.role === 'user' ? 'flex-start' : 'flex-end'}
                mb={1}
                ml={textObject.role === 'user' ? 2 : 0} // Margin-left to move user messages to the right
              >
                <Box
                  bgcolor={textObject.role === 'user' ? 'primary.main' : '#32CD32'}
                  color={'white'}
                  borderRadius={10}
                  p={3}
                  ml={textObject.role === 'user' ? 2 : 0} // Margin-left to move user messages to the right
                >
                  {textObject.parts[0].text}
                </Box>
              </Box>
            ))}
          </Stack>

          {/* Input Area */}
          <Stack 
            direction={'row'} 
            spacing={1} 
            width={'100%'} 
            alignItems={'center'}
            p={2}            

            mt={2}
            borderTop={'1px solid black'} // Border separating input area from chat messages
            height={'70px'} // Fixed height for the input area

          >
            <TextField 
          
              label='Message' 
              value={message} 
              onChange={(e => setMessage(e.target.value))} 
              fullWidth 
            />
            <Button variant='contained' onClick={sendMessage}>Send</Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}