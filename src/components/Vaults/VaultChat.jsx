import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Avatar
} from '@chakra-ui/react';
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { db } from '../../firebase';
import { collectionMap } from '../../constants';
import { useAuth } from '../../provider/AuthProvider';
import { toaster } from '../ui/toaster';

export default function VaultChat({ vaultType = collectionMap.vaults, vaultId }) {
  const { userData } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || !vaultId) return;

    setSending(true);
    try {
      await addDoc(collection(db, vaultType, vaultId, 'messages'), {
        text: input,
        senderId: userData.id,
        senderName: userData.fullName,
        timestamp: serverTimestamp()
      });
      setInput('');
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      toaster.create({
        title: 'Error sending message',
        description: error.message,
        type: 'error',
        duration: 2000,
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (!vaultId) return;

    setLoading(true);
    const q = query(
      collection(db, vaultType, vaultId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [vaultType, vaultId]);

  return (
    <Flex direction="column" h="80vh" w="full" p={{base: 0, md: 4}} maxW="1000px" mx="auto">
      {/* Messages List */}
      <VStack
        spacing={3}
        align="stretch"
        overflowY="auto"
        flex={1}
        px={{base: 0, md: 2}}
        pb={4}
        sx={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {messages.length === 0 && <Flex h='full' w='full' justifyContent='center' alignItems='center' color='gray.500'>Send a Message</Flex>}
        {messages.map((message) => {
          const isSender = message.senderId === userData.id;
          return (
            <HStack key={message.id} gap={2} alignSelf={isSender ? 'flex-end' : 'flex-start'}             maxW="80%">
              {!isSender && (
                  <Avatar.Root size="xs">
                    <Avatar.Fallback name={message.senderName} />
                  </Avatar.Root>
              )}
              <VStack
                alignItems='start'
                bg={isSender ? 'brand.100' : 'gray.100'}
                _dark={{
                  bg: isSender ? 'brand.800/30' : 'gray.700',
                }}
                borderRadius="md"
                gap={0}
                px={2}
                py={2}>
                  <Text fontSize="sm" fontWeight="bold" color="brand.500">
                    {!isSender && message.senderName}
                  </Text>
                <Text>{message.text}</Text>
                <Text fontSize="xs" textAlign="right" opacity={0.6}>
                  {message.timestamp?.toDate().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  }) ?? 'Sending...'}
                </Text>
              </VStack>
            </HStack>
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
            if (e.key === 'Enter') sendMessage();
          }}
          isDisabled={sending}
        />
        <Button onClick={sendMessage} colorScheme="brand" isLoading={sending}>
          Send
        </Button>
      </Flex>
    </Flex>
  );
}