"use client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";

export function Providers({ children }) {
  return (
    <ChakraProvider>
      <ColorModeScript initialColorMode="light" />
      {children}
    </ChakraProvider>
  );
}
