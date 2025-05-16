// components/layout/DashboardLayout.jsx
import { Flex, Box, Skeleton, Spinner } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useEffect, useRef } from "react";
import Loader from "../Resource/Loader";
import { useAuth } from "../../context/authContext";
import { toaster } from "../ui/toaster";
import { pathLinks } from "../../routes";

export const DashboardLayout = () => {
    const { loading, isAuthenticated, error } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if(!loading && !isAuthenticated){
            navigate(pathLinks.signIn)
        }

        if(error){
            toaster.create({
                description: error,
                type: "error",
                duration: 3000,
            })
        }
    }, [isAuthenticated, loading, navigate])

    return (
        <Flex h="100vh" w="100vw" overflow="hidden">

            {loading && <Loader /> }
            <Box display={{ base: "none", lg: "block" }}>
                <Sidebar />
            </Box>

            <Flex flex="1" direction="column" p={{base: 2, md: 4, lg: 4}} overflow="auto">
                <Header />
                <Box flex="1" p={6} overflow='auto' borderRadius="md" shadow="sm">
                    <Outlet />
                </Box>
            </Flex>
        </Flex>
    );
};
