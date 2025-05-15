import React from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  Image,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={6}
    >
      <VStack spacing={6} textAlign="center">
        <Image
          src="https://illustrations.popsy.co/gray/error-404.svg"
          alt="Error Illustration"
          boxSize={{ base: "60%", md: "300px" }}
        />

        <Heading fontSize={{ base: "2xl", md: "4xl" }}>
          Whoops! Something went wrong
        </Heading>

        <Text fontSize="md" color="gray.500" maxW="lg">
          Either this page doesn’t exist, or we hit a snag. Don’t worry, let’s
          get you back on track.
        </Text>

        <Button
          size="lg"
          colorScheme="blue"
          onClick={() => navigate("/")}
        >
          Go Home
        </Button>
      </VStack>
    </Box>
  );
};

export default ErrorPage;
