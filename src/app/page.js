"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";  // Importa el useRouter
import {
  ChakraProvider,
  Spinner,
  Box,
  Stack,
  Image,
  Button,
  Center,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  SimpleGrid,
} from "@chakra-ui/react";
import styles from "./page.module.css";

export default function Home() {

  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 700); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <ChakraProvider>
      <div className={styles.page}>
        <Center bg="tomato" h="100px" color="white">
          <Image
            src="/images/logo.jpg" 
            width={180}
            height={180}
          />
        </Center>

        <main className={styles.main}>
          {loading ? (
            <Spinner
              size="xl"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="green.500"
              mt={4}
            />
          ) : (
            <Box p={4} bg="gray.100" boxShadow="md" borderRadius="md">
              <SimpleGrid columns={[2, null, 5]} spacing="40px">
                <Image src="/images/DorianGrey.jpg" alt="Dorian Grey" borderRadius="md" boxShadow="md" transition="transform 0.2s" _hover={{ transform: "scale(1.05)" }} />
                <Image src="/images/ElExtranjero.jpg" alt="El Extranjero" borderRadius="md" boxShadow="md" transition="transform 0.2s" _hover={{ transform: "scale(1.05)" }} />
                <Image src="/images/LaMetaMorfosis.jpg" alt="La Metamorfosis" borderRadius="md" boxShadow="md" transition="transform 0.2s" _hover={{ transform: "scale(1.05)" }} />
                <Image src="/images/MasAlláDelInvierno.jpg" alt="Más Allá Del Invierno" borderRadius="md" boxShadow="md" transition="transform 0.2s" _hover={{ transform: "scale(1.05)" }} />
                <Image src="/images/PoesiaCompleta.jpg" alt="Poesía Completa" borderRadius="md" boxShadow="md" transition="transform 0.2s" _hover={{ transform: "scale(1.05)" }} />
              </SimpleGrid>
            </Box>
          )}
        </main>
        
        {!loading && (
          <footer className={styles.footer}>
            <div className={styles.footerSection}>
              <Box p={8} bg="gray.100" width="100%" boxShadow="md" borderRadius="md">
                <Text mb={4} fontSize="lg" textAlign="center" fontWeight="bold" color="teal.700">Únete a FIU-Books</Text>
                <Text mb={4} fontSize="md" textAlign="center">
                  Disfruta de una amplia variedad de libros sin costo alguno y descubre nuevas 
                  historias que enriquecerán tu vida,
                  donde podrás organizar tus lecturas, interactuar con una 
                  comunidad apasionada y descubrir nuevas obras según tus intereses.
                  </Text>
                
               <Accordion allowMultiple mb={4}>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as='span' flex='1' textAlign='left'>¿Por qué FIU-Books?</Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                    Es la plataforma ideal para lectores de todas las edades y autores que desean compartir sus obras. 
                    Ofrecemos una experiencia de navegación  que permite buscar, leer, opinar y compartir libros fácilmente.
                    Aceptamos libros escaneados y en varios idiomas, permitiendo a los escritores compartir sus obras sin intermediarios. 
          
                    </AccordionPanel>
                  </AccordionItem>
                  <AccordionItem>
                    {({ isExpanded }) => (
                      <>
                        <h2>
                          <AccordionButton>
                            <Box as='span' flex='1' textAlign='left'>¿Cómo Funciona?</Box>
                            <AccordionIcon />
                          </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                          Simplemente regístrate, comienza a explorar y comparte tus libros favoritos con otros usuarios.
                        </AccordionPanel>
                      </>
                    )}
                  </AccordionItem>
                </Accordion>
                <Stack spacing={4} mb={4} width="100%" alignItems="center" justifyContent="center" direction="row">
                  <Button colorScheme="blue" onClick={() => router.push("/login")} width="200px">Iniciar Sesión</Button>
                  <Button colorScheme="green" onClick={()=> router.push("/register")} width="200px">Registrarse</Button>
                </Stack>
              </Box>
            </div>
          </footer>
        )}
      </div>
    </ChakraProvider>

  );
}
