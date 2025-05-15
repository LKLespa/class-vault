import './App.css';
import React from "react";
import { ChakraProvider, Theme } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import { system } from "./theme";
import routes from "./routes";
import { useTheme } from './hooks/useTheme';

const App = () => {

  const { color, appearance } = useTheme();

  return (
    <ChakraProvider value={system}>
      <Theme colorPalette={color} appearance={appearance}>
        <RouterProvider router={routes} />
      </Theme>
    </ChakraProvider>
  );
};

export default App;

