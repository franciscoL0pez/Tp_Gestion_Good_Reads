"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { Button, Flex, Heading, Text, Box, Divider, SimpleGrid } from "@chakra-ui/react";
import { motion } from "framer-motion"; // Para animaciones
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user] = useAuthState(auth);

  // Lista de libros (con imágenes y títulos)
  const books = [
      { title: "El principito", author: "Antoine de Saint-Exupéry", img: "./fotosPrueba/Principito.avif" },
      { title: "PijamaRayas", author: "John Boyne", img: "./fotosPrueba/PijamaRayas.jpeg" },
      { title: "Harry potter", author: "J.K. Rowling", img: "./fotosPrueba/HarryPotter.jpg" },
      { title: "El mago de oz", author: "L. Frank Baum", img: "./fotosPrueba/ElMagoDeOz.jpg" },
      { title: "El alquimista", author: "Paulo Coelho", img: "./fotosPrueba/ElAlquimista.jpg" },
      { title: "MobyDick", author: "Herman Melville", img: "./fotosPrueba/MobyDick.webp" },
      { title: "Cien años de soledad", author: "Gabriel García Márquez", img: "./fotosPrueba/CienAñosDeSoledad.webp" },
      { title: "1984", author: "George Orwell", img: "./fotosPrueba/1984.png" },
  
  ];

  return (
    <Flex
      direction="column"
      align="center"
      justify="flex-start"
      w="100%"
      h="100%"
      p="3%"
      bg="gray.50"
    >
      {/* Animación de bienvenida */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <Box mb="30px" textAlign="center" w="100%">
          <Heading fontWeight={600} fontSize="28px" color="teal.500" mb="10px">
            Bienvenido, {user?.displayName || "Invitado"}!
          </Heading>
          <Text fontSize="16px" color="gray.600">
            Explora los libros más leídos y añadidos recientemente.
          </Text>
        </Box>
      </motion.div>

      {/* Libros Más Leídos */}
      <Box
        bg="white"
        p="10px"
        borderRadius="12px"
        boxShadow="lg"
        w="100%"
        mb="20px"
      >
        <Heading fontSize="20px" mb="15px" color="teal.600">
          Libros Más Leídos
        </Heading>
        <Divider mb="15px" />

        {/* Grid de libros */}
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing="10px">
          {books.slice(0, 4).map((book, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                bg="white"
                p="10px"
                borderRadius="8px"
                boxShadow="md"
                maxW="150px"
                _hover={{
                  boxShadow: "2xl",
                  transform: "scale(1.05)",
                }}
                transition="box-shadow 0.3s ease, transform 0.3s ease"
              >
                {/* Ajuste de tamaño de la imagen */}
                <img
                  src={book.img}
                  alt={`Cover of ${book.title}`}
                  style={{
                    width: "100%", // La imagen ocupa todo el ancho disponible
                    height: "auto", // Mantiene la proporción de la imagen
                    borderRadius: "8px", // Borde redondeado
                    objectFit: "cover", // Asegura que la imagen cubra el contenedor sin deformarse
                  }}
                />
                <Text fontSize="12px" fontWeight="bold" color="gray.700" mt="10px">
                  {book.title}
                </Text>
                <Text fontSize="11px" color="gray.500">
                  Autor: {book.author}
                </Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>

      {/* Libros Añadidos Recientemente */}
      <Box
        bg="white"
        p="10px"
        borderRadius="12px"
        boxShadow="lg"
        w="100%"
      >
        <Heading fontSize="20px" mb="15px" color="teal.600">
          Libros Añadidos Recientemente
        </Heading>
        <Divider mb="15px" />

        {/* Grid de libros */}
        <SimpleGrid columns={{ base: 2, sm: 3, md: 4 }} spacing="10px">
          {books.slice(4, 8).map((book, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <Box
                bg="white"
                p="10px"
                borderRadius="8px"
                boxShadow="md"
                maxW="150px"
                _hover={{
                  boxShadow: "2xl",
                  transform: "scale(1.05)",
                }}
                transition="box-shadow 0.3s ease, transform 0.3s ease"
              >
                {/* Ajuste de tamaño de la imagen */}
                <img
                  src={book.img}
                  alt={`Cover of ${book.title}`}
                  style={{
                    width: "100%", // La imagen ocupa todo el ancho disponible
                    height: "auto", // Mantiene la proporción de la imagen
                    borderRadius: "8px", // Borde redondeado
                    objectFit: "cover", // Asegura que la imagen cubra el contenedor sin deformarse
                  }}
                />
                <Text fontSize="12px" fontWeight="bold" color="gray.700" mt="10px">
                  {book.title}
                </Text>
                <Text fontSize="11px" color="gray.500">
                  Autor: {book.author}
                </Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>
    </Flex>
  );
}



