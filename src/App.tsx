import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { CurrencyConverter } from "./components/CurrencyConverter.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const theme = extendTheme({
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
});
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <CurrencyConverter />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
