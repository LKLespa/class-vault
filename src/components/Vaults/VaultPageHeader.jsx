import { Flex, Spinner, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { useCollabVault } from '../../provider/CollabVaultProvider'

export default function VaultPageHeader({textAlign = 'center'}) {
    const { vaultData, loading } = useCollabVault()

    if(loading) {
        return <Spinner />
    }

    return (
        <VStack my={0} gap={-1} alignItems={textAlign}>
            <Text fontWeight='semibold' textStyle={{base: 'md', md: 'lg', lg: 'xl'}} color={{base: 'brand.800', _dark: 'brand.300'}}>{vaultData?.name}</Text>
            <Text fontWeight='normal' textStyle={{base: 'xs', md: 'sm', lg: 'md'}}>{vaultData?.description}</Text>
        </VStack>
    )
}
