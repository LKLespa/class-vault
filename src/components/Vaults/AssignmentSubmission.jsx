import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Icon,
  Spinner,
  CloseButton,
} from '@chakra-ui/react';
import {
  addDoc,
  collection,
  doc,
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

export default function AssignmentSubmission({ assignmentId, vaultId, handleClose }) {
  const { userData } = useAuth();
  const { isAdmin, isOwner, vaultType, uploadResource, uploading } = useCollabVault();

  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();

  const [message, setMessage] = useState("");

  const FileIcon = getFileIcon(assignment?.extension);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    console.log('Uploading')
    const result = uploadResource({
      file: file, message: message, type: vaultType, path: 'submissions', data: { assignmentId: assignmentId }
    })

    if (result) {
      setMessage('');
    } else {

    }
  };

useEffect(() => {
  if (!vaultId || !assignmentId) return;
  setLoading(true)
  const unsub = onSnapshot(
    doc(db, vaultType, vaultId, 'assignments', assignmentId),
    (docSnap) => {
      if (docSnap.exists()) {
        setAssignment({ id: docSnap.id, ...docSnap.data() });
        console.log("ASSIGNMENT", assignment, { id: docSnap.id, ...docSnap.data() })
      } else {
        toaster.create({
          title: "Assignment not found",
          type: "error",
        });
      }
    }
  );

  setLoading(false)
  return () => unsub();
}, [vaultId, assignmentId, vaultType]);

  useEffect(() => {
    if (!vaultId || !assignmentId) return;

    setLoading(true);

    const q = query(
      collection(db, vaultType, vaultId, 'submissions'),
      orderBy('timestamp', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((sub) => {
          const matchesAssignment = sub.assignmentId === assignmentId;
          const canView = isAdmin || isOwner || sub.senderId === userData?.id;
          return matchesAssignment && canView;
        });

      setSubmissions(docs);
      console.log('Subs', submissions)
      setLoading(false);
    });

    return () => unsub();
  }, [vaultId, assignmentId, vaultType, isAdmin, isOwner, userData?.id]);

  const formatBytes = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
  };

  if(loading){
    return <Flex h='full' w='full'><Spinner /></Flex>
  }

  return (
    <Flex direction="column" h="80vh" w="full" p={{ base: 0, md: 4 }} maxW="1000px" mx="auto">
      <HStack justifyContent='end'><CloseButton onClick={handleClose} /></HStack>
      <Text>{assignmentId} | {assignment?.id}</Text>
      <HStack gap={3}>
        <Icon as={FileIcon} boxSize={20} color="brand.500" />
        <Box>
          <Text fontWeight="bold" fontSize='2xl' isTruncated maxW="250px">
            {assignment?.name}
          </Text>
          <Text fontSize="md" opacity={0.7} mt={4}>
            {formatBytes(assignment?.fileSize)} • {assignment?.extension.toUpperCase()}
          </Text>
          {assignment?.message && (
            <Text fontSize="md" mt={2} color={{ base: 'brand.700', _dark: 'brand.300' }}>
              {assignment?.message}
            </Text>
          )}
        </Box>
      </HStack>
      {!(isAdmin || isOwner) && (
        <Flex direction="column" gap={3} mb={8}>
          <Input
            placeholder="Optional message about this submission"
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
            Add Submission
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
            {submissions.length === 0 && (
              <Flex h="full" w="full" justifyContent="center" alignItems="center" color="gray.500">
                {(isAdmin || isOwner) ? 'No Submissions Yet' : "You haven't uploaded any submission yet"}
              </Flex>
            )}
            {submissions.map((submission) => {
              const FileIcon = getFileIcon(submission.extension);
              console.log('Resource', submission)
              return (
                <VStack h='fit-content'
                  key={submission.id}
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
                          {submission.name}
                        </Text>
                        <Text fontSize="xs" opacity={0.7}>
                          {formatBytes(submission.fileSize)} • {submission.extension.toUpperCase()}
                        </Text>
                        {submission.message && (
                          <Text fontSize="md" mt={2} color={{ base: 'brand.700', _dark: 'brand.300' }}>
                            {submission.message}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                    <VStack>
                      <Button
                        as="a"
                        href={submission.url}
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
                    {(isAdmin || isOwner) && <Button variant='plain' bg='brand.200/50'>Write Feedback</Button>}
                    <Text fontSize='sm' mt={3} color='gray.400' w='full' textAlign='right'>{submission.senderName} - {formatTimestamp(submission.timestamp)}</Text></HStack>
                </VStack>
              );
            })}
          </VStack>
        </Flex>
  );
}