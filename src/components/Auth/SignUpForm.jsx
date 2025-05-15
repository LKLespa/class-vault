import React, { useState } from "react";
import {
  Box,
  Input,
  Stack,
  Field,
  Fieldset,
  Button,
  Text,
  VStack,
  ToggleRoot,
  HStack,
} from "@chakra-ui/react";

import * as Yup from "yup";
import { Form, Formik, Field as FormikField } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { pathLinks } from "../../routes";

const SignUpSchema = Yup.object().shape({
  fullName: Yup.string().trim().required("Full Name is required"),
  email: Yup.string().trim().required("Email is required").email("Invalid Email Address"),
  phone: Yup.string().trim().matches(/^\d{9,12}$/, "Phone number must be between 9 and 12 digits"),
  password: Yup.string().trim().required("Password is required").min(8, "Password must be at least 8 characters").max(25, "Password is must be less than 25 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  role: Yup.string().oneOf(["student", "teacher"]).required("Role is required"),
})

const SignUpForm = () => {

  const navigate = useNavigate();

  const handleSubmit = (values) => {
      console.log("Form Values >", values);
  }

  return (
    <Box
      p={{ base: 6, md: 8 }}
      maxW="lg"
      mx="auto"
      bg="background"
      borderRadius="xl"
    >
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          role: "",
        }}

        validationSchema={SignUpSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, setFieldValue, values }) =>
          <Form>
            <Fieldset.Root size='lg' spacing={2}>
              <Fieldset.Content w="full">
                <Stack spacing={4}>
                <Fieldset.Legend fontSize="2xl" fontWeight="bold">
                  Create Your Account
                </Fieldset.Legend>
                <Fieldset.HelperText>
                  Please provide your contact details below.
                </Fieldset.HelperText>
              </Stack>
              
                <Field.Root invalid={errors.role && touched.role}>
                  <HStack w="full">
                    <Field.Label>Role</Field.Label>
                    <Button
                      variant={values.role === "student" ? "solid" : "outline"}
                      flexGrow={1}
                      onClick={() => setFieldValue("role", "student")}
                    >
                      Student
                    </Button>
                    <Button
                      variant={values.role === "teacher" ? "solid" : "outline"}
                      flexGrow={1}
                      onClick={() => setFieldValue("role", "teacher")}
                    >
                      Teacher
                    </Button>
                  </HStack>
                  {errors.role && touched.role && (
                    <Field.ErrorText>{errors.role}</Field.ErrorText>
                  )}
                </Field.Root>
              </Fieldset.Content>

              {/* ⬇️ move VStack outside of Fieldset.Content */}
              <VStack spacing={4} mt={6}>
                {/* Full Name */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.fullName && touched.fullName}>
                    <Field.Label>Full Name</Field.Label>
                    <FormikField as={Input} name="fullName" placeholder="John Doe" />
                    <Field.ErrorText>{errors.fullName}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                {/* Email */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.email && touched.email}>
                    <Field.Label>Email Address</Field.Label>
                    <FormikField as={Input} name="email" type="email" placeholder="you@example.com" />
                    <Field.ErrorText>{errors.email}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                {/* Phone */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.phone && touched.phone}>
                    <Field.Label>Phone Number</Field.Label>
                    <FormikField as={Input} name="phone" type="tel" placeholder="0700000000" />
                    <Field.ErrorText>{errors.phone}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                {/* Password */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.password && touched.password}>
                    <Field.Label>Password</Field.Label>
                    <FormikField as={Input} name="password" type="password" placeholder="••••••••" />
                    <Field.ErrorText>{errors.password}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                {/* Confirm Password */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.confirmPassword && touched.confirmPassword}>
                    <Field.Label>Confirm Password</Field.Label>
                    <FormikField as={Input} name="confirmPassword" type="password" placeholder="••••••••" />
                    <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                <Button type="submit" size="lg" w="full" mt={4}>
                  Sign Up
                </Button>

                <Link to={pathLinks.signIn}>
                  <Text fontSize="sm" textAlign="center">
                  Already have an account? Sign In
                </Text>
                </Link>
              </VStack>

            </Fieldset.Root>
          </Form>
        }
      </Formik>
    </Box>
  );
};

export default SignUpForm;
