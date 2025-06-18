import {
    Box,
    Button,
    Flex,
    Input,
    Text,
    VStack,
    HStack,
    Divider,
    useToast,
    Separator,
    Icon,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    addDoc,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useCollabVault } from '../../provider/CollabVaultProvider';
import { useAuth } from '../../provider/AuthProvider';
import { format } from 'date-fns';
import { getFileIcon } from '../../utils/file-functions';

export default function VaultReminders({ vaultId }) {
    const { userData } = useAuth();
    const { isAdmin, isOwner, vaultType, sendReminder } = useCollabVault();

    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [date, setDate] = useState('');
    const [description, setDescription] = useState('');
    const [sending, setSending] = useState(false);

    const dateInputRef = useRef();

    const handleSendReminder = async () => {
        await sendReminder({ description: description, dueDate: date })
    };

    useEffect(() => {
        if (!vaultId) return;

        setLoading(true);
        const q = query(
            collection(db, vaultType, vaultId, 'reminders'),
            orderBy('dueDate', 'asc')
        );

        const unsub = onSnapshot(q, (snap) => {
            const items = snap.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setReminders(items);
            setLoading(false);
        });

        console.log('Reminders', reminders)

        return () => unsub();
    }, [vaultId, vaultType]);

    return (
        <Flex direction="column" maxW="800px" mx="auto" p={4} gap={6}>
            {(isAdmin || isOwner) && (
                <VStack align="start" spacing={4}>
                    <Text fontWeight="bold" fontSize="xl">
                        Create Reminder
                    </Text>
                    <VStack alignItems="start" w="full">
                        <Text fontSize="sm" color="gray.500">
                            Select Due Date
                        </Text>
                        <HStack w="full">
                            <Input
                                ref={dateInputRef}
                                value={date}
                                type="datetime-local"
                                onChange={(e) => setDate(e.target.value)}
                                flex={1}
                            />
                            <Button variant="outline" onClick={() => setDate('')}>
                                Clear
                            </Button>
                        </HStack>
                        <HStack w='full'><Input
                            placeholder="Reminder description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            flexGrow={1}
                        />
                            <Button
                                colorScheme="brand"
                                onClick={handleSendReminder}
                                isLoading={sending}
                            >
                                Send Reminder
                            </Button></HStack>
                    </VStack>
                    <Separator />
                </VStack>
            )}

            <VStack align="start" spacing={4}>
                <Text fontWeight="bold" fontSize="lg">
                    Vault Reminders
                </Text>
                {reminders.length === 0 && (
                    <Text color="gray.500">No reminders yet.</Text>
                )}
                {reminders.map((reminder) => (
                    <HStack
                        key={reminder.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="md"
                        alignItems='center'
                        justifyContent='center'
                        w="full"
                        bg="gray.50"
                        _dark={{ bg: 'gray.700' }}
                    >
                        <Box flex={1}>
                            <Text fontWeight="medium" mb={1}>
                                {reminder.description}
                            </Text>
                            <Text fontSize="sm" color="gray.500">
                                Due:{" "}
                                {reminder.dueDate
                                    ? format(
                                        reminder.dueDate.toDate?.() ?? reminder.dueDate,
                                        "EEE d, h:mmaaa"
                                    )
                                    : '—'}
                            </Text>
                            <Text fontSize="sm" color="gray.400">
                                By: {reminder.createdByName}
                            </Text>
                            {reminder.data && (
                                <Text mt={4} fontSize='md' textWrap='wrap'>{reminder.data.fileName}</Text>
                            )}
                        </Box>
                        {reminder.data && (
                            <Box as='a' target='_blank' href={reminder.data.fileUrl}>
                                 <Icon as={getFileIcon(reminder.data.fileExtension)} boxSize={{ base: 10, md: 15, lg: 20 }} color="brand.500" h={30} w={30} />
                            </Box>
                        )}
                    </HStack>
                ))}
            </VStack>
        </Flex>
    );
}
