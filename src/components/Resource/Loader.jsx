import { Box, Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import React from 'react'

export default function Loader() {
  return (
    <Box width='100vw' height='100vh' position='fixed' top={0} left={0}  padding={10} zIndex={10}>
        <Flex bg={{base: "gray.200/50", _dark: "gray.800/10"}} height='full' width='full' borderRadius={10} backdropFilter={'blur(10px)'} justifyContent='center' alignItems='center'>
                <VStack>
                    <Spinner size="xl" />
                    
                <Text fontSize="lg" fontWeight='500' color={{base: "gray.800", _dark: "gray.300"}}>Please Wait</Text>
                </VStack>
        </Flex>
    </Box>
  )
}
