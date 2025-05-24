import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

const messages = [
  { id: 1, msg: 'Hi There', sender: 'me' },
  { id: 2, msg: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit.', sender: 'M. Hs' },
  { id: 3, msg: 'How are you doing?', sender: 'me' },
  { id: 4, msg: "Good to go!", sender: 'VS' },
];

export default function VaultChat() {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    // You would send this message to Firestore here
    console.log('Sending:', input);
    setInput('');
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Flex direction="column" h="80vh" w="full" p={4} maxWidth={1000} mx='auto'>
      {/* Messages List */}
      <VStack
        spacing={3}
        align="stretch"
        overflowY="auto"
        flex={1}
        px={2}
        pb={4}
        sx={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {messages.map((message) => {
          const isSender = message.sender === 'me';
          return (
            <Box
              key={message.id}
              alignSelf={isSender ? 'flex-end' : 'flex-start'}
              maxWidth="80%"
              bg={isSender ? 'brand.100' : 'gray.100'}
              _dark={{
                bg: isSender ? 'brand.800/30' : 'gray.700',
              }}
              borderRadius="md"
              px={4}
              py={2}
            >
                {!isSender && <Text color='brand.500'>{message.sender}</Text>}
              <Text>{message.msg}</Text>
              <Text fontSize="xs" textAlign="right" opacity={0.6}>
                9:30 AM
              </Text>
            </Box>
          );
        })}
        <div ref={bottomRef} />
      </VStack>

      {/* Input Field */}
      <Flex mt={4} gap={2}>
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <Button onClick={handleSend} colorScheme="brand">
          Send
        </Button>
      </Flex>
    </Flex>
  );
}
