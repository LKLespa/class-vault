import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  VStack,
  HStack,
  Icon,
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

export default function VaultResource({ vaultId }) {
  const { userData } = useAuth();
  const { isAdmin, isOwner, vaultType, uploadResource, uploading } = useCollabVault();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);

  const inputRef = useRef();

  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    console.log('Uploading')
    const result = uploadResource({
      file: file, message: message, type: vaultType, data: {}
    })

    if (result) {
      setMessage('');
    } else {

    }
  };

  useEffect(() => {
    if (!vaultId) return;
    setLoading(true);
    const q = query(
      collection(db, vaultType, vaultId, 'resources'),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResources(docs);
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

  return (
    <Flex direction="column" h="80vh" w="full" p={{ base: 0, md: 4 }} maxW="1000px" mx="auto">
      {(isAdmin || isOwner) && (
        <Flex direction="column" gap={3} mb={4}>
          <Input
            placeholder="Optional message about this resource"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <input
            ref={inputRef}
            type="file"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <Button onClick={() => inputRef.current.click()} colorScheme="brand" loading={uploading} loadingText='Uploading...'>
            Upload Resource
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
        {resources.length === 0 && (
          <Flex h="full" w="full" justifyContent="center" alignItems="center" color="gray.500">
            No resources uploaded yet.
          </Flex>
        )}
        {resources.map((resource) => {
          const FileIcon = getFileIcon(resource.extension);
          console.log('Resource', resource)
          return (
            <VStack h='fit-content'
              key={resource.id}
              p={4}
              borderRadius="md"
              bg={{ base: 'gray.100', _dark: 'gray.700' }}
              _hover={{ bg: { base: 'gray.200', _dark: 'gray.600' } }}>
              <HStack
                justifyContent="space-between"
                w='100%'
              >
                <HStack gap={3}>
                  <Icon as={FileIcon} boxSize={6} color="brand.500" />
                  <Box>
                    <Text fontWeight="bold" isTruncated maxW="250px">
                      {resource.name}
                    </Text>
                    <Text fontSize="xs" opacity={0.7}>
                      {formatBytes(resource.fileSize)} • {resource.extension.toUpperCase()}
                    </Text>
                    {resource.message && (
                      <Text fontSize="md" mt={2} color={{base: 'brand.700', _dark: 'brand.300'}}>
                        {resource.message}
                      </Text>
                    )}
                  </Box>
                </HStack>
                <Button
                  as="a"
                  href={resource.url}
                  target="_blank"
                  size="sm"
                  colorScheme="brand"
                  variant="outline"
                >
                  View
                </Button>
              </HStack>
              <Text fontSize='sm' mt={3} color='gray.400' w='full' textAlign='right'>{resource.senderName} - {formatTimestamp(resource.timestamp)}</Text>
            </VStack>
          );
        })}
      </VStack>
    </Flex>
  );
}