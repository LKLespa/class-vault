import { Flex, Text, VStack, Tabs, Box } from '@chakra-ui/react'
import React from 'react'
import { CollabVaultProvider, useCollabVault } from '../provider/CollabVaultProvider'
import { useParams } from 'react-router-dom'
import Loader from '../components/Resource/Loader';
import VaultPageHeader from '../components/Vaults/VaultPageHeader';
import { LuBell, LuFile, LuMessageCircle, LuSendToBack, LuShare, LuSkipBack, LuUsers } from 'react-icons/lu';
import VaultMembers from '../components/Vaults/VaultMembers';
import VaultChat from '../components/Vaults/VaultChat'
import { collectionMap } from '../constants';
import VaultSubmissions from '../components/Vaults/VaultAssignments';
import VaultResource from '../components/Vaults/VaultResource';
import VaultReminders from '../components/Vaults/VaultReminders';

export default function CollabVaultPage() {
    const { vaultID } = useParams();
    console.log(vaultID)

    return (
        <CollabVaultProvider vaultId={vaultID}>
            <VStack>
                <Tabs.Root defaultValue='chat' variant='outline' width='full'>
                    <Box pb={2} display={{ base: 'block', lg: 'none' }}><VaultPageHeader /></Box>
                    <Tabs.List alignItems='end'>
                        <Box p={2} pe={5} display={{ base: 'none', lg: 'flex' }}><VaultPageHeader textAlign='start' /></Box>
                        <Tabs.Trigger value="chat" flex={1}>
                            <Box display={{ base: 'flex', md: 'none', lg: 'flex' }}>
                                <LuMessageCircle size='20px' />
                            </Box>
                            <Text display={{ base: 'none', md: 'flex' }}>Chat</Text>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="resources" flex={1}> <Box display={{ base: 'flex', md: 'none', lg: 'flex' }}>
                            <LuFile size='20px' />
                        </Box>
                            <Text display={{ base: 'none', md: 'flex' }}>Resources</Text></Tabs.Trigger>
                        <Tabs.Trigger value="submissions" flex={1}> <Box display={{ base: 'flex', md: 'none', lg: 'flex' }}>
                            <LuShare size='20px' />
                        </Box>
                            <Text display={{ base: 'none', md: 'flex' }}>Assignments</Text>
                        </Tabs.Trigger>
                        <Tabs.Trigger value="reminders" flex={1}> <Box display={{ base: 'flex', md: 'none', lg: 'flex' }}>
                            <LuBell size='20px' />
                        </Box>
                            <Text display={{ base: 'none', md: 'flex' }}>Reminders</Text></Tabs.Trigger>
                        <Tabs.Trigger value="members"> <Box display={{ base: 'flex', md: 'none', lg: 'flex' }}>
                            <LuUsers size='20px' />
                        </Box>
                            <Text display={{ base: 'none', md: 'flex' }}>Members</Text></Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Content value="chat">
                        <VaultChat vaultId={vaultID} vaultType={collectionMap.collabvaults} />
                    </Tabs.Content>
                    <Tabs.Content value="resources">
                        <VaultResource vaultId={vaultID} vaultType={collectionMap.collabvaults} />
                    </Tabs.Content>
                    <Tabs.Content value="submissions">
                        <VaultSubmissions vaultId={vaultID} vaultType={collectionMap.collabvaults} />
                    </Tabs.Content>
                    <Tabs.Content value="reminders">
                        <VaultReminders vaultId={vaultID} />
                    </Tabs.Content>
                    <Tabs.Content value="members">
                        <VaultMembers />
                    </Tabs.Content>
                </Tabs.Root>
            </VStack>
        </CollabVaultProvider>
    )
}
