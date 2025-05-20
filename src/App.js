import './App.css';
import { Box } from "@chakra-ui/react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes";
import { AuthProvider } from './provider/AuthProvider';
import { Toaster } from './components/ui/toaster';
import { Provider } from './components/ui/provider';
import { VaultsProvider } from './provider/VaultsProvider';

const App = () => {

  return (
    <Provider>
      <Box colorPalette='brand'>
        <AuthProvider>
          <VaultsProvider>
            <RouterProvider router={routes} />
            <Toaster />
          </VaultsProvider>
        </AuthProvider>
      </Box>
    </Provider>
  );
};

export default App;

