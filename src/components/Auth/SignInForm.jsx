import React from "react";
import {
  Box,
  Input,
  Stack,
  Field,
  Fieldset,
  Button,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form, Field as FormikField } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { pathLinks } from "../../routes";
import { useAuth } from "../../context/authContext";

// 🔐 Yup Validation Schema
const SignInSchema = Yup.object().shape({
  email: Yup.string().trim().required("Email is required").email("Invalid email address"),
  password: Yup.string().trim().required("Password is required"),
});

const SignInForm = () => {

  const { signIn, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (values) => {
    signIn({
      email: values.email,
      password: values.password,
      onDone: () => navigate(pathLinks.home)
    })
  }

  return (
    <Box
      p={{ base: 6, md: 8 }}
      maxW="lg"
      mx="auto"
      borderRadius="xl"
    >
      <Formik
        initialValues={{ email: "mbahlesky4@gmail.com", password: "lespanio" }}
        validationSchema={SignInSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Fieldset.Root size="lg" spacing={2}>
              <Stack spacing={4}>
                <Fieldset.Legend fontSize="2xl" fontWeight="bold">
                  Welcome Back
                </Fieldset.Legend>
                <Fieldset.HelperText>
                  Please enter your login credentials.
                </Fieldset.HelperText>
              </Stack>

              <VStack spacing={4} mt={6}>
                {/* Email */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.email && touched.email}>
                    <Field.Label>Email Address</Field.Label>
                    <FormikField
                      as={Input}
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                    <Field.ErrorText>{errors.email}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                {/* Password */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.password && touched.password}>
                    <Field.Label>Password</Field.Label>
                    <FormikField
                      as={Input}
                      name="password"
                      type="password"
                      placeholder="••••••••"
                    />
                    <Field.ErrorText>{errors.password}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                <Button type="submit" size="lg" w="full" mt={4} loading={loading}>
                  Sign In
                </Button>

                <Link to={pathLinks.signUp}>
                  <Text fontSize="sm" textAlign="center">
                  Don't have an account? 
                    Sign Up
                </Text>
                </Link>
              </VStack>
            </Fieldset.Root>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default SignInForm;
