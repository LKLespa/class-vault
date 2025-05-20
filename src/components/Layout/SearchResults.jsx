import { Box, Button, CloseButton, DataList, DataListItem, Flex, HStack, IconButton, Input, InputGroup, List, Spinner, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { LuSearch } from 'react-icons/lu'
import { db } from '../../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { toaster } from '../ui/toaster';
import { useNavigate } from 'react-router-dom';
import { pathLinks } from '../../routes';
import { useAuth } from '../../provider/AuthProvider';
import { collectionMap } from '../../constants';
import { useVaults } from '../../provider/VaultsProvider';

export default function SearchResults({ open, setOpen, query, setQuery }) {
    const { userData } = useAuth();
    const { loading: requesting, sentJoinRequest, cancelJoinRequest, } = useVaults();
    const [clicks, setClicks] = useState(0);

    const [results, setResults] = useState({
        institutes: [],
        classrooms: [],
        classvaults: [],
        collabvaults: [],
    });
    const [tempQuery, setTempQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const fetchInstituteName = async (instituteId) => {
        if (!instituteId) return null;
        try {
            const instDoc = await getDoc(doc(db, 'institutes', instituteId));
            return instDoc.exists() ? instDoc.data().name : null;
        } catch (err) {
            console.error('Error fetching institute name:', err);
            return null;
        }
    };

    const searchCollections = async () => {
        if (!query?.trim()) return;

        setLoading(true);
        try {
            const newResults = {};

            for (let col of Object.keys(collectionMap)) {
                const snap = await getDocs(collection(db, col));
                let docs = await Promise.all(
                    snap.docs.map(async (docSnap) => {
                        const data = { id: docSnap.id, ...docSnap.data() };
                        if ((col === 'classrooms' || col === 'classvaults') && data.instituteId) {
                            data.instituteName = await fetchInstituteName(data.instituteId);
                        }
                        return data;
                    })
                );

                newResults[col.toLowerCase()] = docs.filter(
                    item =>
                        item.name?.toLowerCase().includes(query.toLowerCase()) ||
                        item.description?.toLowerCase().includes(query.toLowerCase())
                );
            }

            setResults(newResults);
        } catch (error) {
            toaster.create({
                title: 'Search error',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        searchCollections();
        console.log('Results', results);
    }, [query, clicks])

    const userInVault = (vault) => {
        const members = vault?.members || [];
        const students = vault?.students || [];
        const teachers = vault?.teachers || [];
        const admins = vault?.admins || [];
        return [...members, ...students, ...teachers, ...admins].includes(userData.id);
    }

    const userHasSentRequest = (vault) => {
        const request = vault?.joinRequests || [];
        return request.includes(userData.id);
    }


    const handleNavigate = ({ key, id }) => {
        setOpen(false)
        console.log('Key', key, id)
        navigate(`${pathLinks[key]}/${id}`)
    }

    return (<Flex position='fixed' top={{ base: '0', lg: '50px' }} left='0' zIndex='10' h='100vh' w='100vw' padding={10} justifyContent='center' alignItems='center'>
        <VStack h='full' w='full' maxWidth={500} borderRadius={10} backdropFilter={'blur(20px)'} gap={5} padding={10} pt={12} bg='whiteAlpha.800' _dark={{ bg: 'blackAlpha.600' }}>
            <CloseButton position='absolute' top='5px' right='10px' onClick={() => setOpen(false)} variant='ghost' />
            <InputGroup width='full' display={{ base: 'flex', lg: 'none' }} endElement={<IconButton variant="ghost"><LuSearch /></IconButton>}>
                <Input placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
            </InputGroup>

            <VStack overflow='auto' w='full'>
                {loading ? (
                    <Spinner size="lg" />
                ) : (
                    Object.keys(collectionMap).map((key) =>
                        results[key]?.length > 0 ? (
                            <Box key={key} w='full'>
                                <Text fontWeight='bold' textTransform='capitalize' mb={2}>
                                    {key}
                                </Text>
                                <DataList.Root orientation='horizontal' divideY='1px'>
                                    {results[key].map((item) => (
                                        <DataList.Item
                                            key={item.id}
                                            p={3}
                                            borderRadius='md'
                                            _hover={{ bg: 'gray.500/20' }}
                                            cursor='pointer'
                                        >
                                            <DataList.ItemValue>
                                                <VStack alignItems='start'>
                                                    <Text fontWeight='medium'>{item.name}</Text>
                                                    <Text fontSize='sm' color='gray.500'>
                                                        {item.description}
                                                    </Text>
                                                    {(item.instituteName || item.instituteId) && (
                                                        <Text fontSize='xs' color='gray.400'>
                                                            Institute: {item.instituteName ?? item.instituteId}
                                                        </Text>
                                                    )}
                                                </VStack>
                                            </DataList.ItemValue>
                                            <DataList.ItemLabel>
                                                {userInVault(item) && <Button variant='ghost' onClick={() => handleNavigate({ key: key, id: item.id })}>View More</Button>}
                                                {!userInVault(item) && !userHasSentRequest(item) && <Button variant='ghost' onClick={() => {
                                                    sentJoinRequest({ vaultId: item.id, collectionName: collectionMap[key] })
                                                    setClicks(prev => prev + 1)
                                                }}>Join</Button>}
                                                {userHasSentRequest(item) && <Button variant='ghost' color='red.500' onClick={() => {
                                                    cancelJoinRequest({ userId: userData.id, vaultId: item.id, collectionName: collectionMap[key] })

                                                    setClicks(prev => prev + 1)
                                                }}>Cancel Request</Button>}
                                            </DataList.ItemLabel>
                                        </DataList.Item>
                                    ))}
                                </DataList.Root>
                            </Box>
                        ) : null
                    )
                )}
            </VStack>
        </VStack>
    </Flex>
    );
}