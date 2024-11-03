"use client";

import {
  Button,
  Card,
  Flex,
  Heading,
  Skeleton,
  Text,
  Box,
  VStack,
  Divider,
  Image,
  HStack,
} from "@chakra-ui/react";
import { useState } from "react";

// Componente para mostrar un libro y permitir moverlo entre las listas
const BookItem = ({ book, onMove, inProgress }) => {
  return (
    <Card
      p={"15px"}
      w={"100%"}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={"15px"}
      bg={"gray.50"}
      borderWidth="1px"
      borderRadius={"10px"}
      _hover={{ boxShadow: "lg", bg: "gray.100" }}
      transition="all 0.3s ease"
    >
      <HStack spacing={3}>
        <Image
          src={book.image}
          alt={book.title}
          boxSize="50px"
          objectFit="cover"
          borderRadius={"5px"}
        />
        <Text fontSize={"16px"} fontWeight="600" color="gray.700">
          {book.title}
        </Text>
      </HStack>
      <Button
        colorScheme={inProgress ? "blue" : "green"}
        variant="solid"
        size="sm"
        onClick={() => onMove(book)}
        _hover={{ transform: "scale(1.05)" }}
        transition="all 0.2s ease"
      >
        {inProgress ? "Completado" : "Lectura en curso"}
      </Button>
    </Card>
  );
};

// Componente principal que contiene las listas de libros
const Books = () => {
  const [booksInProgress, setBooksInProgress] = useState([
    { id: 1, title: "Clean Code", image: "https://m.media-amazon.com/images/I/41xShlnTZTL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg" },
  ]);

  const [completedBooks, setCompletedBooks] = useState([
    { id: 4, title: "JavaScript", image: "https://m.media-amazon.com/images/I/51XhEC2yfvL._SX218_BO1,204,203,200_QL40_FMwebp_.jpg" },
    { id: 5, title: "Patrones de Diseño", image: "https://m.media-amazon.com/images/I/51MzUZtKqPL._SX404_BO1,204,203,200_.jpg" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  const markAsCompleted = (book) => {
    setBooksInProgress((prev) => prev.filter((b) => b.id !== book.id));
    setCompletedBooks((prev) => [...prev, book]);
  };

  const moveToInProgress = (book) => {
    setCompletedBooks((prev) => prev.filter((b) => b.id !== book.id));
    setBooksInProgress((prev) => [...prev, book]);
  };

  const filteredInProgress = booksInProgress.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCompleted = completedBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Skeleton padding={"5%"} w={"100%"} h={"100%"} borderRadius={"20px"} isLoaded={true}>
      <Flex justify={"space-between"} align={"center"} mb={"30px"}>
        <Heading fontWeight={500} fontSize={"40px"} color="teal.600">
          Mis libros
        </Heading>
      </Flex>

      <Flex justifyContent="space-between">
        <Box
          bg={"white"}
          p={"25px"}
          borderRadius={"15px"}
          boxShadow="lg"
          maxW={"70%"}
        >
          {/* Sección de Lecturas en Curso */}
          <Box mb={"30px"}>
            <Heading fontSize={"28px"} mb={"20px"} color="teal.500">
              Leyendo ahora
            </Heading>
            <Divider mb={"15px"} />
            <VStack spacing={4} align="stretch">
              {filteredInProgress.length > 0 ? (
                filteredInProgress.map((book) => (
                  <BookItem key={book.id} book={book} onMove={markAsCompleted} inProgress />
                ))
              ) : (
                <Text fontSize={"16px"} color="gray.600">
                  No tienes libros en curso.
                </Text>
              )}
            </VStack>
          </Box>

          {/* Sección de Lecturas Completadas */}
          <Box>
            <Heading fontSize={"28px"} mb={"20px"} color="teal.500">
              Lecturas completadas
            </Heading>
            <Divider mb={"15px"} />
            <VStack spacing={4} align="stretch">
              {filteredCompleted.length > 0 ? (
                filteredCompleted.map((book) => (
                  <BookItem key={book.id} book={book} onMove={moveToInProgress} />
                ))
              ) : (
                <Text fontSize={"16px"} color="gray.600">
                  No tienes libros completados.
                </Text>
              )}
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Skeleton>
  );
};

export default Books;



