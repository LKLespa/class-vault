import {
  Box,
  Flex,
  Heading,
  Text,
  VStack,
  Button,
  SimpleGrid,
  List,
  ListItem,
  Badge,
  useDisclosure,
  Card,
  Icon,
  Popover,
} from "@chakra-ui/react";
import { useAuth } from "../provider/AuthProvider";
import { useState } from "react";
import { useColorModeValue } from "../components/ui/color-mode";
import { LuPlus, LuBookOpen, LuCalendar } from "react-icons/lu";
import { FiBell } from "react-icons/fi";
import NewVaultModal from "../components/Vaults/NewVaultModal";

export default function HomePage() {
  const { userData } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [openVaultMenu, setOpenVaultMenu] = useState(false);

  const stats = {
    recentUploads: 5,
    assignments: 4,
    deadlines: 2,
    notifications: 3,
  };

  const recentUploads = [
    "Biology Notes - Photosynthesis",
    "Math Exercise Sheet",
    "History Presentation Slides",
  ];

  const assignments = [
    "Math Homework - Due May 18",
    "English Essay - Due May 20",
    "Physics Lab Report - Due May 22",
  ];

  const deadlines = [
    { title: "Submit Science Project", date: "May 25, 2025" },
    { title: "Prepare for Geography Test", date: "May 28, 2025" },
  ];

  const notifications = [
    "Platform maintenance on May 19",
    "New UI update available",
    "Vault chat enabled",
  ];

  const bg = useColorModeValue("gray.50", "gray.950");
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box p={6} minH="100%" bg={bg}>
      <VStack align="start" gap={6} maxW="1200px" mx="auto">
        {/* First Row: Create Vault + Institute Info */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} height={{ base: '100px', lg: '250px'
        }} gap={6} w="100%">
          <NewVaultModal open={openVaultMenu} setOpen={setOpenVaultMenu}>
            <Card.Root bg="brand.600" cursor='pointer'>
            <Card.Body display='flex' justifyContent='center' alignItems='center'>
              <Icon size='xl'>
                <LuPlus />
              </Icon>
              <Text textStyle='xl'>Create New Vault</Text>
            </Card.Body>
          </Card.Root>
          </NewVaultModal>

          <Card.Root title="Your Institute(s)">
            <Card.Body>
              <Text fontSize="sm">TechBridge Academy</Text>
            <Text fontSize="sm">Royal STEM Institute</Text>
            </Card.Body>
          </Card.Root>
        </SimpleGrid>
        
         <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="100%">
          <CardBox title="Requests" count={stats.recentUploads} icon={<LuBookOpen />}>
            <List.Root spacing={2} fontSize="sm">
              {recentUploads.map((item, idx) => (
                <List.Item key={idx}>{item}</List.Item>
              ))}
            </List.Root>
          </CardBox>

          <CardBox title="Applications" count={stats.assignments}>
            <List.Root spacing={2} fontSize="sm">
              {assignments.map((item, idx) => (
                <List.Item key={idx}>{item}</List.Item>
              ))}
            </List.Root>
          </CardBox>
        </SimpleGrid>

        {/* Second Row: Dashboard Sections */}
        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6} w="100%">
          <CardBox title="Recent Uploads" count={stats.recentUploads} icon={<LuBookOpen />}>
            <List.Root spacing={2} fontSize="sm">
              {recentUploads.map((item, idx) => (
                <List.Item key={idx}>{item}</List.Item>
              ))}
            </List.Root>
          </CardBox>

          <CardBox title="Assignments" count={stats.assignments}>
            <List.Root spacing={2} fontSize="sm">
              {assignments.map((item, idx) => (
                <List.Item key={idx}>{item}</List.Item>
              ))}
            </List.Root>
          </CardBox>

          <CardBox title="Reminders" count={stats.deadlines} icon={<LuCalendar />}>
            <List.Root spacing={2} fontSize="sm">
              {deadlines.map(({ title, date }, idx) => (
                <List.Item key={idx}>
                  <Text fontWeight="medium">{title}</Text>
                  <Text fontSize="xs" color="gray.500">Due: {date}</Text>
                </List.Item>
              ))}
            </List.Root>
          </CardBox>

          <CardBox title="Notifications" count={stats.notifications} icon={<FiBell />}>
            <List.Root spacing={2} fontSize="sm">
              {notifications.map((note, idx) => (
                <List.Item key={idx}>{note}</List.Item>
              ))}
            </List.Root>
          </CardBox>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}

// 🔄 Reusable Card Component
function CardBox({ title, count, icon, children }) {
  const bg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Box
      bg={bg}
      border="1px"
      borderColor={borderColor}
      p={6}
      borderRadius="md"
      boxShadow="sm"
      minH="200px"
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Heading size="sm">{title}</Heading>
        {count !== undefined && (
          <Badge colorScheme="purple" fontSize="xs">
            {count}
          </Badge>
        )}
        {icon}
      </Flex>
      {children}
    </Box>
  );
}
