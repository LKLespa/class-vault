import './App.css';
import React from "react";
import { Box, ChakraProvider, Theme } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { system } from "./theme";
import routes from "./routes";
import { useTheme } from './hooks/useTheme';
import { AuthProvider } from './context/authContext';
import { Toaster } from './components/ui/toaster';
import { Provider } from './components/ui/provider';

const App = () => {

  const { color, appearance } = useTheme();

  return (
    <Provider>
      <Box colorPalette='brand'>
        <AuthProvider>
        <RouterProvider router={routes} />
      <Toaster />
      </AuthProvider>
      </Box>
    </Provider>
  );
};

export default App;

