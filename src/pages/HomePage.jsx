import React from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { toaster } from "../components/ui/toaster";
import { pathLinks } from "../routes";
import { useAuth } from "../context/authContext";
import { ColorModeButton } from "../components/ui/color-mode";

const HomePage = () => {
  const { isAuthenticated, userData, loading, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <Box minH="100vh" py={16}>
      <Container maxW="container.md">
        <VStack spacing={6} textAlign="center">
          <Heading size="2xl" fontWeight="bold">
            Welcome to ClassConnect 📚
          </Heading>

          <Text fontSize="lg" color="gray.600">
            A collaborative platform for students and teachers to share resources,
            manage assignments, and engage in academic discussions.
          </Text>

          <HStack spacing={4} mt={6}>
            <Button colorScheme="teal" size="lg" onClick={() => {
              navigate(pathLinks.signIn)
            }}>
              Get Started
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/about")}>
              Learn More
            </Button>
          </HStack>

          <Text>{isAuthenticated ? "Authenticated" : "Not Authenticated"}</Text>
          <Button onClick={() => signOut()} loading={loading}>
            Sign Out
          </Button>
          <Text>
             <div style={{ padding: "2rem" }}>
      <h1>Welcome back, {userData?.fullName || "User"}!</h1>
      <p><strong>Email:</strong> {userData?.email}</p>
      <p><strong>Phone Number:</strong> {userData?.phoneNumber}</p>
      <p><strong>Role:</strong> {userData?.role}</p>
      <p><strong>Joined on:</strong> {userData?.dateCreated?.toDate?.().toLocaleString() || "Loading date..."}</p>
    </div>
          </Text>

          <ColorModeButton />
        </VStack>
      </Container>
    </Box>
  );
};

export default HomePage;
