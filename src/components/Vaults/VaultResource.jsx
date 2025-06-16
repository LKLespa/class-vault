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
  serverTimestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from 'firebase/storage';
import { AiOutlineFilePdf, AiOutlineFileImage, AiOutlineFile } from 'react-icons/ai';
import { useEffect, useRef, useState } from 'react';
import { db, storage } from '../../firebase';
import { collectionMap } from '../../constants';
import { useAuth } from '../../provider/AuthProvider';
import { toaster } from '../ui/toaster';
import { v4 as uuidv4 } from 'uuid';
import { getFileIcon } from '../../utils/file-functions';
import { useVaults } from '../../provider/VaultsProvider';
import { useCollabVault } from '../../provider/CollabVaultProvider';

export default function VaultResource({vaultId}) {
  const { userData } = useAuth();
  const { isAdmin, isOwner, vaultType } = useCollabVault();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !vaultId) return;

    const fileId = uuidv4();
    const extension = file.name.split('.').pop();
    const storageRef = ref(storage, `vaults/${vaultId}/resources/${fileId}.${extension}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    toaster.create({ title: 'Uploading...', duration: 1500 });

    uploadTask.on(
      'state_changed',
      null,
      (error) => {
        toaster.create({
          title: 'Upload failed',
          description: error.message,
          type: 'error',
        });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        await addDoc(collection(db, vaultType, vaultId, 'resources'), {
          name: file.name,
          url: downloadURL,
          fileSize: file.size,
          extension,
          type: file.type,
          timestamp: serverTimestamp(),
          senderId: userData.id,
        });
        toaster.create({ title: 'Uploaded successfully' });
      }
    );
  };

  useEffect(() => {
    if (!vaultId) return;

    console.log("VaultType", vaultId, vaultType)

    setLoading(true);
    const q = query(
      collection(db, vaultType, vaultId, 'resources'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
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
        <Flex mb={4}>
          <input
            ref={inputRef}
            type="file"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          <Button onClick={() => inputRef.current.click()} colorScheme="brand">
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
          return (
            <HStack
              key={resource.id}
              p={4}
              borderRadius="md"
              bg={{base: 'gray.100', _dark: 'gray.700'}}
              justifyContent="space-between"
              _hover={{ bg: {base: 'gray.200', _dark: 'gray.600'}}}
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
          );
        })}
      </VStack>
    </Flex>
  );
}
