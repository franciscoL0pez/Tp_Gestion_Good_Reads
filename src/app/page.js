
"use client"; // Marca el componente como un Client Component

import { useEffect, useState } from "react";
import { ChakraProvider, Spinner, Box, Stack, Image, Button, Center, Link, SimpleGrid } from "@chakra-ui/react";
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
        {/* Cabecera con el Center */}
        <Center bg="tomato" h="100px" color="white">
          <Image
            src="/images/logo.jpg" 
            width={180} // Ancho de la imagen
            height={180} // Alto de la imagen
            priority // Carga prioritaria
          />
        </Center>

        <main className={styles.main}>
          
          {loading ? (
            <>
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
            <>
              {/* Sección con 5  imágenes */}
              <Box p={4} bg="gray.100">
             
              <SimpleGrid columns={[2, null, 5]} spacing="40px">
                <Image 
                  src="/images/DorianGrey.jpg" 
                  alt="Dorian Grey" 
                  borderRadius="md"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }} // Efecto hover
                />
                <Image 
                  src="/images/ElExtranjero.jpg" 
                  alt="El Extranjero" 
                  borderRadius="md"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }} 
                />
                <Image 
                  src="/images/LaMetaMorfosis.jpg" 
                  alt="La Metamorfosis" 
                  borderRadius="md"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }} 
                />
                <Image 
                  src="/images/MasAlláDelInvierno.jpg" 
                  alt="Más Allá Del Invierno" 
                  borderRadius="md"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }} 
                />
                <Image 
                  src="/images/PoesiaCompleta.jpg" 
                  alt="Poesía Completa" 
                  borderRadius="md"
                  boxShadow="md"
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.05)" }} 
                />
              </SimpleGrid>
              </Box>
              
            </>
          )}
        </main>
        
        {!loading && ( // El footer solo se mostrará si loading es false
          <footer className={styles.footer}>
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
