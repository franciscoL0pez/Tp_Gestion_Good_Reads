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
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getBookLists, updateBookList } from "@/services/bookList"; // Servicio para interactuar con Firebase
import { useUserData } from "@/hooks/useUserData";  // Hook para obtener el usuario actual

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
    >
      <Text fontSize="16px" fontWeight="bold" color="gray.700">
        {book.title}
      </Text>
      <Button
        colorScheme={inProgress ? "blue" : "green"}
        variant="solid"
        size="sm"
        onClick={() => onMove(book)}
      >
        {inProgress ? "Completado" : "Lectura en curso"}
      </Button>
    </Card>
  );
};

const ListOfBooks = () => {
  const [booksInProgress, setBooksInProgress] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const { user } = useUserData(); // Uso el us de useUserData para obtener el usuario actual

  useEffect(() => {
    if (user) {
      loadBookLists(user.uid);
    }
  }, [user]);

  const loadBookLists = async (uid) => {
    try {
      const { booksInProgress, completedBooks } = await getBookLists(uid);
      setBooksInProgress(booksInProgress);
      setCompletedBooks(completedBooks);
    } catch (error) {
      console.error("Error loading book lists:", error);
    }
  };

  const markAsCompleted = async (book) => {
    setBooksInProgress((prev) => prev.filter((b) => b.id !== book.id));
    setCompletedBooks((prev) => [...prev, book]);
    await updateBookList(user.uid, booksInProgress, completedBooks);
  };

  const moveToInProgress = async (book) => {
    setCompletedBooks((prev) => prev.filter((b) => b.id !== book.id));
    setBooksInProgress((prev) => [...prev, book]);
    await updateBookList(user.uid, booksInProgress, completedBooks);
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
              Lecturas en curso
            </Heading>
            <Divider mb="15px" />
            <Box maxH="300px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {booksInProgress.length > 0 ? (
                  booksInProgress.map((book) => (
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
              Lecturas completadas
            </Heading>
            <Divider mb="15px" />
            <Box maxH="300px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {completedBooks.length > 0 ? (
                  completedBooks.map((book) => (
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
    </Skeleton>
  );
};

export default ListOfBooks;

