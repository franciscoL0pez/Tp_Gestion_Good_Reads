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
import ViewBookModal from "@/components/books/ViewBookModal";

const BookItem = ({ book, onMove, inProgress }) => {
  return (
    <Card
      p="15px"
      w="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb="10px"
      bg="white"
      borderWidth="1px"
      borderRadius="10px"
      boxShadow="md"
      _hover={{ boxShadow: "lg", transform: "translateY(-5px)", bg: "gray.50" }}
      transition="all 0.3s ease"
    >
      <HStack spacing={4} alignItems="center">
        <Box boxSize="60px" display="flex" justifyContent="center" alignItems="center">
          <Image
            src={`/fotosPrueba/${book.image}`}
            alt={book.title}
            boxSize="100%"
            objectFit="cover"
            borderRadius="5px"
          />
        </Box>
        <Text fontSize="16px" fontWeight="bold" color="gray.700" noOfLines={1}>
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
  const [booksInProgress, setBooksInProgress] = useState([
    { id: 1, title: "El Alquimista", image: "ElAlquimista.jpg" },
    { id: 2, title: "1984", image: "1984.png" },
  ]);
  const [completedBooks, setCompletedBooks] = useState([
    { id: 3, title: "Moby Dick", image: "MobyDick.webp" },
  ]);
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

  //Añado el libro
  const addBookToReadingList = (book) => {
    setBooksInProgress((prev) => [...prev, book]);
    setViewBookModalOpen(false);
  };

  //Borro el libro de la lista
  const removeBookFromReadingList = (book) => {
    setBooksInProgress((prev) => prev.filter((b) => b.id !== book.id));
    setViewBookModalOpen(false); 
  };

  const openViewBookModal = (book) => {
    setSelectedBook(book);
    setViewBookModalOpen(true);
  };

  return (
    <Skeleton padding="5%" w="100%" h="100%" borderRadius="20px" isLoaded={true}>
      <Flex justify="space-between" align="center" mb="30px">
        <Heading
          fontWeight={600}
          fontSize="26px"
          bgGradient="linear(to-r, teal.500, green.500)"
          bgClip="text"
        >
          Mis Libros
        </Heading>
      </Flex>

      <Flex justifyContent="flex-start" wrap="wrap" maxW="35%">
        <Box
          bg="white"
          p="20px"
          borderRadius="15px"
          boxShadow="xl"
          maxW="90%"
          flex="1"
          minW="250px"
        >
          <Box mb="30px">
            <Heading fontSize="22px" mb="15px" color="teal.600">
              Leyendo Ahora
            </Heading>
            <Divider mb="15px" />
            <Box maxH="300px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {filteredInProgress.length > 0 ? (
                  filteredInProgress.map((book) => (
                    <BookItem key={book.id} book={book} onMove={markAsCompleted} inProgress />
                  ))
                ) : (
                  <Text fontSize="14px" color="gray.600">
                    No tienes libros en curso.
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>
          <Box>
            <Heading fontSize="22px" mb="15px" color="teal.600">
              Lecturas Completadas
            </Heading>
            <Divider mb="15px" />
            <Box maxH="300px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {filteredCompleted.length > 0 ? (
                  filteredCompleted.map((book) => (
                    <BookItem key={book.id} book={book} onMove={moveToInProgress} />
                  ))
                ) : (
                  <Text fontSize="14px" color="gray.600">
                    No tienes libros completados.
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>
        </Box>
      </Flex>

      {selectedBook && (
        <ViewBookModal
          isOpen={isViewBookModalOpen}
          onClose={() => setViewBookModalOpen(false)}
          book={selectedBook}
          onAddToReadingList={addBookToReadingList}
          onRemoveFromReadingList={removeBookFromReadingList}
        />
      )}
    </Skeleton>
  );
};

export default BooksList;

