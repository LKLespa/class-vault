import {
    Avatar,
    Box,
    Button,
    CloseButton,
    Drawer,
    Flex,
    HStack,
    Heading,
    IconButton,
    Input,
    InputGroup,
    Menu,
    Portal,
    Text,
    VStack,
    useBreakpointValue,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import { useTheme } from "../../hooks/useTheme";
import { useAuth } from "../../provider/AuthProvider";
import { ColorModeButton } from "../ui/color-mode";
import { LuHam, LuMenu, LuPlus, LuSearch } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import NewVaultModal from "../Vaults/NewVaultModal";
import { pathLinks } from "../../routes";
import SearchResults from "./SearchResults";

export default function Header() {
    const { userData } = useAuth();
    const [openDrawer, setOpenDrawer] = useState(false);
    const [openVaultMenu, setOpenVaultMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const navigate = useNavigate();

    console.log("User data", userData)

    useEffect(() => {
        if(searchQuery.trim()){
            setOpenSearchModal(true)
        }
    }, [searchQuery])

    return (
        <Drawer.Root open={openDrawer}>
            <Drawer.Trigger asChild >
                <Flex
                    justify="space-between"
                    align="center"
                    mb={6}
                    px={2}
                    py={3}
                    borderBottom="1px solid"
                    borderColor="gray.100"
                >
                    {openSearchModal && <SearchResults query={searchQuery} setQuery={setSearchQuery} open={openSearchModal} setOpen={setOpenSearchModal} />}
                    <Text fontSize="xl" fontWeight="semibold">
                        {userData?.fullName || "Welcome"}
                    </Text>
                    <HStack display={{ base: "none", lg: "flex" }}>
                        <InputGroup maxWidth='300px' endElement={<IconButton variant="ghost"><LuSearch /></IconButton>}>
                            <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
                        </InputGroup>
                        <NewVaultModal open={openVaultMenu} setOpen={setOpenVaultMenu}>
                            <Button variant='subtle'>
                            New Vault <LuPlus />
                        </Button>
                        </NewVaultModal>
                    </HStack>

                    <HStack spacing={3}>
                        <IconButton display={{ base: "flex", lg: "none" }} variant="ghost" onClick={() => setOpenSearchModal(true)}><LuSearch /></IconButton>
                        <ColorModeButton />
                        <IconButton variant="ghost" onClick={() => navigate(pathLinks.notifications)}><FiBell /></IconButton>
                        <Avatar.Root display={{ base: "none", lg: "flex" }} cursor='pointer' onClick={() => navigate(pathLinks.profile)}>
                            <Avatar.Fallback name={userData?.fullName} />
                        </Avatar.Root>
                        <IconButton display={{ base: "flex", lg: "none" }} variant="ghost" onClick={() => setOpenDrawer(true)}><LuMenu /></IconButton>
                    </HStack>
                </Flex>
            </Drawer.Trigger>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner padding={4}>
                    <Drawer.Content rounded={4} width='fit-content'>
                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={() => setOpenDrawer(false)}/>
                        </Drawer.CloseTrigger>
                        <Sidebar />
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}
