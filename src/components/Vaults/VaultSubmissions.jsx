import {
  Box,
  Text,
  VStack,
  HStack,
  Icon,
  Badge,
  Spinner,
  Flex,
  Link,
} from '@chakra-ui/react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../../firebase';
import { useAuth } from '../../provider/AuthProvider';
import { getFileIcon } from '../../utils/file-functions';

export default function VaultSubmissions({
  vaultType,
  vaultId
}) {
  const { userData } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!vaultId) return;

    const q = query(
      collection(db, vaultType, vaultId, 'submissions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubmissions(fetched);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [vaultType, vaultId]);

  if (loading) {
    return (
      <Flex align="center" justify="center" h="full">
        <Spinner size="lg" />
      </Flex>
    );
  }

  if (submissions.length === 0) {
    return (
      <Flex align="center" justify="center"  direction="column" h="80vh" w="full" color="gray.500">
        No submissions yet.
      </Flex>
    );
  }

  return (
    <VStack direction="column" h="80vh" w="full" align="stretch" spacing={4}>
      {submissions.map((submission) => {
        const IconComponent = getFileIcon(submission.extension);
        return (
          <HStack
            key={submission.id}
            border="1px solid"
            borderColor="gray.200"
            _dark={{ borderColor: 'gray.700' }}
            borderRadius="md"
            p={3}
            spacing={4}
            align="center"
            justify="space-between"
          >
            <HStack spacing={3}>
              <Icon as={IconComponent} boxSize={6} color="brand.500" />
              <Box>
                <Text fontWeight="semibold">{submission.name}</Text>
                <Text fontSize="sm" color="gray.500">
                  Submitted by: {submission.senderName}
                </Text>
              </Box>
            </HStack>
            <VStack spacing={1} align="end">
              <Badge colorScheme="blue" variant="outline">
                {submission.extension.toUpperCase()}
              </Badge>
              <Text fontSize="xs" color="gray.500">
                {submission.fileSize} KB
              </Text>
              <Link
                href={submission.url}
                target="_blank"
                rel="noopener noreferrer"
                fontSize="sm"
                color="blue.500"
              >
                View
              </Link>
            </VStack>
          </HStack>
        );
      })}
    </VStack>
  );
}
