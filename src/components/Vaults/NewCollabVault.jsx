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
  Textarea,
} from "@chakra-ui/react";
import * as Yup from "yup";
import { Formik, Form, Field as FormikField } from "formik";
import { useNavigate } from "react-router-dom";
import { useVaults } from "../../provider/VaultsProvider";

// 🔐 Yup Validation Schema
const CreateVaultSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is required"),
  description: Yup.string().trim(),
});

export default function NewCollabVaultForm({ onDone }) {

  const { createCollabVault, loading: creating, error } = useVaults();

  const handleSubmit = (values) => {
    createCollabVault({
        name: values.name,
        description: values.description,
        onDone: onDone
    })
    console.log("Values", values)
  }

  return (
    <Box
      p={{ base: 6, md: 8 }}
      maxW="lg"
      mx="auto"
      borderRadius="xl"
    >
      <Formik
        initialValues={{ name: "", description: "" }}
        validationSchema={CreateVaultSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form>
            <Fieldset.Root size="lg" spacing={2}>
              <Stack spacing={4}>
                <Fieldset.Legend fontSize="2xl" fontWeight="bold">
                  Create a Collaborative Vault
                </Fieldset.Legend>
              </Stack>

              <VStack spacing={4} mt={6}>
                {/* Name */}
                <Fieldset.Content w="full">
                  <Field.Root invalid={!!errors.name && touched.name}>
                    <Field.Label>Give a Name</Field.Label>
                    <FormikField
                      as={Input}
                      name="name"
                      type="name"
                      placeholder="Vault Name"
                    />
                    <Field.ErrorText>{errors.name}</Field.ErrorText>
                  </Field.Root>
                </Fieldset.Content>

                {/* Password */}
                <Fieldset.Content w="full">
                  <Field.Root>
                    <Field.Label>Description</Field.Label>
                    <FormikField
                      as={Textarea}
                      name='description'
                      placeholder="Description..."
                    />
                  </Field.Root>
                </Fieldset.Content>

                <Button type="submit" size="lg" w="full" mt={4} loading={creating} loadingText={'Creating...'}>
                  Create
                </Button>
                <Text color='red.500'>{error}</Text>
              </VStack>
            </Fieldset.Root>
          </Form>
        )}
      </Formik>
    </Box>
  );
};
