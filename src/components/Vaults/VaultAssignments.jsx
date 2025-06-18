import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Icon,
  Dialog,
  Portal,
} from '@chakra-ui/react';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineFilePdf, AiOutlineFileImage, AiOutlineFile } from 'react-icons/ai';
import { db, storage } from '../../firebase';
import { collectionMap } from '../../constants';
import { useAuth } from '../../provider/AuthProvider';
import { toaster } from '../ui/toaster';
import { v4 as uuidv4 } from 'uuid';
import { formatTimestamp, getFileIcon } from '../../utils/file-functions';
import { useVaults } from '../../provider/VaultsProvider';
import { useCollabVault } from '../../provider/CollabVaultProvider';
import { LuArrowRight } from 'react-icons/lu';
import AssignmentSubmission from './AssignmentSubmission';

export default function VaultAssigments({ vaultId }) {
  const { userData } = useAuth();
  const { isAdmin, isOwner, vaultType, uploadResource, uploading, sendReminder } = useCollabVault();
  const [openSubmissionModal, setOpenSubmissionModal] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentAssignmentId, setCurrentAssignmentId] = useState('');

  const inputRef = useRef();

  const [message, setMessage] = useState("");
  const [date, setDate] = useState('');
  const dateInputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    console.log('Uploading')
    const result = await uploadResource({
      file: file, message: message, type: vaultType, path: 'assignments', data: {}
    })

    if (result) {
      await sendReminder({dueDate: date, description: message, data: {fileUrl: result.url, fileName: result.name, fileExtension: result.extension}})
      alert('one')
      setMessage('');
      setDate('');
    } else {

    }
  };

  useEffect(() => {
    if (!vaultId) return;
    setLoading(true);
    const q = query(
      collection(db, vaultType, vaultId, 'assignments'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignments(docs);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [vaultId, vaultType]);

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    console.log('Date', typeof(date), date)
    setDate(date)
  }

  return (
    <Flex direction="column" h="80vh" w="full" p={{ base: 0, md: 4 }} maxW="1000px" mx="auto">
      {(isAdmin || isOwner) && (
        <Flex direction="column" gap={3} mb={4}>
          <VStack alignItems='start'>
            <Text fontSize='sm' color='gray.500'>Select Due Date</Text>
          <HStack>
            <Input ref={dateInputRef} value={date} type='datetime-local' id='date-input' placeholder='Enter due date' onChange={handleDateChange}/>
            <Button variant={'plain'} onClick={() => setDate('')}>Clear</Button>
          </HStack>
          </VStack>
          <Input
            placeholder="Message about this assignment"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            ref={inputRef}
            type="file"
            accept=".png, .pdf, .doc, .docx, .txt"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <Button onClick={() => inputRef.current.click()} colorScheme="brand" loading={uploading} loadingText='Uploading...'>
            Add Assignment
          </Button>
        </Flex>
      )}

      <VStack
        spacing={4}
        align="stretch"
        overflowY="auto"
        flex={1}
        px={{ base: 0, md: 2 }}
        pb={4}
        sx={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {assignments.length === 0 && (
          <Flex h="full" w="full" justifyContent="center" alignItems="center" color="gray.500">
            No assignments uploaded yet.
          </Flex>
        )}
        {assignments.map((assignment) => {
          const FileIcon = getFileIcon(assignment.extension);
          // console.log('assignment', assignment)
          return (
            <VStack h='fit-content'
              key={assignment.id}
              p={4}
              borderRadius="md"
              bg={{ base: 'gray.100', _dark: 'gray.700' }}
              _hover={{ bg: { base: 'gray.200', _dark: 'gray.600' } }}>
              <HStack
                justifyContent="space-between"
                w='100%'
              >
                <HStack gap={3}>
                  <Icon as={FileIcon} boxSize={{ base: 10, md: 15, lg: 20 }} color="brand.500" />
                  <Box>
                    <Text fontWeight="bold" isTruncated maxW="250px">
                      {assignment.name}
                    </Text>
                    <Text fontSize="xs" opacity={0.7}>
                      {formatBytes(assignment.fileSize)} • {assignment.extension.toUpperCase()}
                    </Text>
                    {assignment.message && (
                      <Text fontSize="md" mt={2} color={{ base: 'brand.700', _dark: 'brand.300' }}>
                        {assignment.message}
                      </Text>
                    )}
                  </Box>
                </HStack>
                <VStack>
                  <Button
                    as="a"
                    href={assignment.url}
                    target="_blank"
                    size="sm"
                    colorScheme="brand"
                    variant="outline"
                  >
                    View
                  </Button>
                </VStack>
              </HStack>
              <HStack w='full' justifyContent='space-between'>
                <Submissions open={openSubmissionModal} setOpen={setOpenSubmissionModal}>
                  <AssignmentSubmission vaultId={vaultId} assignmentId={currentAssignmentId} handleClose={() => setOpenSubmissionModal(false)} />
                </Submissions>
                <Button variant='plain' bg='brand.200/50' onClick={() => { setCurrentAssignmentId(assignment.id); setOpenSubmissionModal(true) }}>Submissions</Button>
                <Text fontSize='sm' mt={3} color='gray.400' w='full' textAlign='right'>{assignment.senderName} - {formatTimestamp(assignment.timestamp)}</Text></HStack>
            </VStack>
          );
        })}
      </VStack>
    </Flex>
  );
}


function Submissions({ children, open, setOpen }) {
  return (
    <Dialog.Root lazyMount open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content width='80vh' maxW='1200px' minW='400px'>
            <Dialog.Body>
              {children}
            </Dialog.Body>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
