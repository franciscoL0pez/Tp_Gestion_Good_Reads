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
import ViewBookModal from "@/components/books/ViewBookModal"; // Asegúrate de importar el modal

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

const BooksList = () => {
  const [booksInProgress, setBooksInProgress] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [isViewBookModalOpen, setViewBookModalOpen] = useState(false);

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

  const addBookToReadingList = (book) => {
    setBooksInProgress((prev) => [...prev, book]);
    setViewBookModalOpen(false); // Cerrar el modal después de añadir el libro
  };

  const openViewBookModal = (book) => {
    setSelectedBook(book);
    setViewBookModalOpen(true);
  };

  return (
    <Skeleton padding={"5%"} w={"100%"} h={"100%"} borderRadius={"20px"} isLoaded={true}>
      <Flex justify={"space-between"} align={"center"} mb={"30px"}>
        <Heading fontWeight={500} fontSize={"40px"} color="dark">
          Mis libros
        </Heading>
      </Flex>

      <Flex justifyContent="space-between">
        <Box bg={"white"} p={"25px"} borderRadius={"15px"} boxShadow="lg" maxW={"70%"}>
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

      {selectedBook && (
        <ViewBookModal
          isOpen={isViewBookModalOpen}
          onClose={() => setViewBookModalOpen(false)}
          book={selectedBook}
          onEdit={() => {}} // Implementa la lógica de edición aquí
          onAddToReadingList={addBookToReadingList} // Pasar la función
        />
      )}
    </Skeleton>
  );
};

export default BooksList;






