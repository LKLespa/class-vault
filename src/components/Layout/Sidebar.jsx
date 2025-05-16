// components/layout/Sidebar.jsx
import { VStack, HStack, Text, Box, Avatar } from "@chakra-ui/react";
import { FiHome, FiFolder, FiUsers, FiSettings, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { pathLinks } from "../../routes";

const navLinks = [
  { label: "Home", icon: FiHome, path: "/" },
  { label: "My Vaults", icon: FiUser, path: ""},
  { label: "ClassVaults", icon: FiFolder, path: "/classvaults" },
  { label: "CollabVaults", icon: FiUsers, path: "/collabvaults" },
  { label: "Settings", icon: FiSettings, path: "/settings" },
];

export default function Sidebar() {
    const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <VStack
      w="250px"
      h="100vh"
      bg="brand.500"
      spacing={5}
      align="stretch"
      px={4}
      py={6}
      boxShadow="md"
    >
      <Text fontSize="2xl" fontWeight="bold" color="brand.900" mb={6}>
        QuickClass
      </Text>

      {navLinks.map((link) => {
        const active = location.pathname === link.path;

        return (
          <HStack
            key={link.label}
            p={3}
            borderRadius="md"
            bg={active ? "brand.300" : "transparent"}
            _hover={{ bg: "brand.400", cursor: "pointer" }}
            onClick={() => navigate(link.path)}
          >
            <Box as={link.icon} />
            <Text>{link.label}</Text>
          </HStack>
        );
      })}
        <HStack
            p={3}
            borderRadius="md"
            bg={location.pathname === pathLinks.profile ? "brand.300" : "transparent"}
            _hover={{ bg: "brand.400", cursor: "pointer" }}
            onClick={() => navigate(pathLinks.profile)}
          >
            <Avatar.Root>
                <Avatar.Fallback name={userData?.fullName} />
            </Avatar.Root>
            <Text>Profile</Text>
          </HStack>
      <Box flex="1" />

      <HStack
        p={3}
        borderRadius="md"
        _hover={{ bg: "red.100", cursor: "pointer" }}
        onClick={signOut}
      >
        <Box as={FiLogOut} />
        <Text>Logout</Text>
      </HStack>
    </VStack>
  );
};
