import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useTheme } from "../hooks/useTheme";

export default function AuthWrapper() {
  const { color } = useTheme();

  return (
    <Flex minH="100vh" px={{ base: 4, sm: 6, md: 8 }} py={8}>
      <Flex
        direction={{ base: "column", md: "row" }}
        align="stretch"
        justify="center"
        maxW={{ base: "100%", md: "4xl" }}
        mx="auto"
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
        bg="white"
      >
        {/* Left Section (Branding) */}
        <Box
          flex="1"
          p={{ base: 6, md: 10 }}
          textAlign="center"
          bg={color || "blue.500"} // fallback
          color="white"
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <VStack spacing={4}>
            <Heading fontWeight="bold" fontSize={{ base: "xl", md: "2xl" }}>
              📘 ClassVault
            </Heading>
            <Text fontSize={{ base: "sm", md: "md" }}>
              Welcome! Sign in or create an account to get started.
            </Text>
          </VStack>
        </Box>

        {/* Right Section (Form Area) */}
        <Box flex="1" p={{ base: 6, md: 10 }}>
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
}
