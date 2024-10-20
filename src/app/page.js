"use client"; // Marca el componente como un Client Component

import { useEffect, useState } from "react";
import { ChakraProvider, Spinner, Box, Stack, Image, Button } from "@chakra-ui/react";
import styles from "./page.module.css";

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); 

    return () => clearTimeout(timer); // Limpia el timer si el componente se desmonta
  }, []);

  return (
    <ChakraProvider>
      <div className={styles.page}>
        <main className={styles.main}>
          {loading ? (
            <>
            
              <Image
                className={styles.logo}
                src="/images/logo.jpg" // Ruta de la imagen local
                alt="Descripción de la imagen"
                width={180}
                height={180}
                priority
              />
              <Spinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="green.500"
                mt={4}
              />
            </>
          ) : (
            <Box 
              p={4} 
              position="relative"
              bg="white.100"
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height={{ base: "20vh", md: "40vh", lg: "20vh" }} // Altura adaptable
              overflow="hidden"
              flexDirection="column" // Para centrar verticalmente
            > {}
              
              <Image
                src="/images/logo.jpg" 
                width={180} // Ancho de la imagen
                height={180} // Alto de la imagen
                priority // Carga prioritaria
              />
             
            
            </Box>
            
          )}
        </main>
        {!loading && ( // El footer solo se mostrará si loading es false
          <footer className={styles.footer}>
            {/* Código del footer va aquí */}
            <Stack spacing={4} mb={4} width="100%" alignItems="center">
              <Button colorScheme="blue" onClick={() => alert("Iniciar Sesión")}>
                Iniciar Sesión
              </Button>
              <Button colorScheme="green" onClick={() => alert("Registrarse")}>
                Registrarse
              </Button>
            </Stack>
          </footer>
        )}
      </div>
    </ChakraProvider>
  );
}
