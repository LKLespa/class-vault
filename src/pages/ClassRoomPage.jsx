import { Flex, Text } from '@chakra-ui/react'
import React from 'react'

export default function ClassRoomPage() {
  return (
       <Flex>
            <p>Tabs</p>
            <Text>
                Details, Teachers, Students (Use Accordions for the 2nd and 3rd)
            </Text>
             <Text>
                ClassVaults
            </Text>
            <Text>
                Resource Vault (message could be resource as well)
            </Text>
        </Flex>
  )
}
