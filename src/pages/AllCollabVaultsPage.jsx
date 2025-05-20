import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  VStack,
  HStack,
  Icon,
  Button,
} from "@chakra-ui/react";
import { FiFolder } from "react-icons/fi";
import { Link as RouterLink } from "react-router-dom";
import { useVaults } from "../provider/VaultsProvider";
import NewVaultModal from "../components/Vaults/NewVaultModal";
import { LuPlus } from "react-icons/lu";
import { pathLinks } from "../routes";

const AllCollabVaultsPage = () => {
  const [openVaultMenu, setOpenVaultMenu] = useState(false)
  const {
    collabvaults,
    loading,
    error,
  } = useVaults();

  return (
    <Box p={6}>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Your Collaborative Vaults</Heading>
        <NewVaultModal open={openVaultMenu} setOpen={setOpenVaultMenu}>
          <Button variant='subtle'>
            New Vault <LuPlus />
          </Button></NewVaultModal>
      </HStack>

      {loading ? (
        <VStack mt={10}>
          <Spinner size="xl" />
          <Text>Loading vaults...</Text>
        </VStack>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : collabvaults.length === 0 ? (
        <Text>No vaults found. Create one to get started!</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={5}>
          {collabvaults.map((vault) => (
            <Box
              key={vault.id}
              as={RouterLink}
              to={`${pathLinks.collabvaults}/${vault.id}`}
              p={5}
              shadow="md"
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: 'gray.500/20' }}
              transition="all 0.2s"
            >
              <HStack spacing={4}>
                <Icon as={FiFolder} boxSize={6} color="blue.500" />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="bold">{vault.name}</Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={2}>
                    {vault.description}
                  </Text>
                </VStack>
              </HStack>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default AllCollabVaultsPage;
