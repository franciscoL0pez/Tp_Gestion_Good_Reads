"use client";
import {
  Box,
  Stack,
  Image,
  Button,
  Center,
  SimpleGrid,
} from "@chakra-ui/react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <Center bg="tomato" h="100px" color="white">
        <Image src="/images/logo.jpg" width={180} height={180} />
      </Center>

      <main className={styles.main}>
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
      </main>

      <footer className={styles.footer}>
        <Stack spacing={4} mb={4} width="100%" alignItems="center">
          <Button
            colorScheme="blue"
            onClick={() => {
              router.push("/login");
            }}
          >
            Iniciar Sesión
          </Button>
          <Button
            colorScheme="green"
            onClick={() => {
              router.push("/register");
            }}
          >
            Registrarse
          </Button>
        </Stack>
      </footer>
    </div>
  );
}
