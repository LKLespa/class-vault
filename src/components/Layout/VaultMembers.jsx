import { Box, Heading, VStack, HStack, Text, Button, Divider, Spinner, Separator, Kbd } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useCollabVault } from "../../provider/CollabVaultProvider";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { useVaults } from "../../provider/VaultsProvider";
import { collectionMap } from "../../constants";

export default function VaultMembersPage() {
  const { vaultData, loading, vaultType } = useCollabVault();
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
      <Section title="Join Requests" users={joinRequests}>
        {joinRequests.map(user => (
          <Button size="sm" colorScheme="green" onClick={() =>{ 
            console.log("DATA", user.id, vaultData.id, vaultType)
            handleApprove(user.id)}}>
            Approve
          </Button>
        ))}
      </Section>

      <Separator />

      <Section title="Admins" users={admins}>
            <Kbd>Admin</Kbd>
        </Section>

      <Separator />

      <Section title="Members" users={members} />
    </VStack>
  );
}

function Section({ title, users, children }) {
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
                <Text fontWeight="medium">{user.fullName}</Text>
                <Text fontSize="sm" color="gray.500">{user.email}</Text>
              </VStack>
              {children}
            </HStack>
          ))}
        </VStack>
      )}
    </Box>
  );
}
