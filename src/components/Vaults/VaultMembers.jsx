import { Box, Heading, VStack, HStack, Text, Button, Divider, Spinner, Separator, Kbd } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCollabVault } from "../../provider/CollabVaultProvider";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useVaults } from "../../provider/VaultsProvider";
import { collectionMap } from "../../constants";
import { useAuth } from "../../provider/AuthProvider";

export default function VaultMembers() {
  const { vaultData, loading, vaultType, isOwner, isAdmin } = useCollabVault();
  const { userData } = useAuth();
  const { approveJoinRequest } = useVaults();
  const [joinRequests, setJoinRequests] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async (userId) => {
    try {
      const snap = await getDoc(doc(db, "users", userId));
      return snap.exists() ? { id: userId, ...snap.data() } : null;
    } catch (err) {
      console.error("Error fetching user:", err);
      return null;
    }
  };

  console.log('Data', vaultData)

  useEffect(() => {
    const loadUsers = async () => {
      if (!vaultData) return;

      setIsLoading(true);

      const [requests, adminUsers, allMemberUsers] = await Promise.all([
        Promise.all(vaultData.joinRequests?.map(fetchUserData) || []),
        Promise.all(vaultData.admins?.map(fetchUserData) || []),
        Promise.all(vaultData.members?.map(fetchUserData) || [])
      ]);

      const adminIDs = new Set(vaultData.admins);
      const filteredMembers = allMemberUsers.filter(user => !adminIDs.has(user.id));

      setJoinRequests(requests.filter(Boolean));
      setAdmins(adminUsers.filter(Boolean));
      setMembers(filteredMembers.filter(Boolean));
      setIsLoading(false);
    };

    loadUsers();
  }, [vaultData]);

  const handleApprove = async (userId) => {
    await approveJoinRequest({ userId: userId, vaultId: vaultData.id, collectionName: vaultType });
  };

  if (loading || isLoading) {
    return (
      <VStack py={10}>
        <Spinner />
        <Text>Loading members...</Text>
      </VStack>
    );
  }

  return (
    <VStack align="start" spacing={6} p={6} w="full" maxWidth='500px'>
      {(isOwner || isAdmin) && <Section title="Join Requests" users={joinRequests} userId={userData.id} type='request' action={handleApprove}>
      </Section>}

      <Separator />

      <Section title="Admins" users={admins} userId={userData.id}>
        <Kbd>Admin</Kbd>
      </Section>

      <Separator />

      <Section title="Members" users={members} userId={userData.id} />
    </VStack>
  );
}

function Section({ title, users, children, userId, type, action = null }) {
  return (
    <Box w="full">
      <Heading size="md" mb={3}>{title}</Heading>
      {users.length === 0 ? (
        <Text fontSize="sm" color="gray.500">No {title.toLowerCase()} yet.</Text>
      ) : (
        <VStack align="start" spacing={3}>
          {users.map(user => (
            <HStack key={user.id} justify="space-between" w="full">
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium">{user.fullName} {user.id === userId && <Kbd>Me</Kbd>}</Text>
                <Text fontSize="sm" color="gray.500">{user.email}</Text>
              </VStack>
              {type === 'request' && <Button size="sm" colorScheme="green" onClick={() => {
                action(user.id)
              }}>
                Approve
              </Button>}
              {children}
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
}
