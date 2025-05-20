import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function InstitutePage() {
  return (
    <Flex>
        <p>Tabs</p>
        <Text>
            Details, heads, Teachers, Students (Use Accordions for the 2nd, 3rd and 4th)
        </Text>
         <Text>
            ClassRooms
        </Text>
        <Text>
            Resource Vault (message could be resource as well)
        </Text>
    </Flex>
  )
}
