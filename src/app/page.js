"use client";
import { Box, Stack, Image, Button } from "@chakra-ui/react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
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
        >
          {" "}
          {}
          <Image
            src="/images/logo.jpg"
            width={180} // Ancho de la imagen
            height={180} // Alto de la imagen
            priority // Carga prioritaria
          />
        </Box>
      </main>
      <footer className={styles.footer}>
        {/* Código del footer va aquí */}
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
