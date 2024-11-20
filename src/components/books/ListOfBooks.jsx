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
  CircularProgress,
  CircularProgressLabel,
  useBreakpointValue,
  SlideFade,
  Alert,
  AlertIcon
} from "@chakra-ui/react";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { getBooklist, updateBooklist } from "@/services/bookList";

const IN_PROGRESS = "in_progress";
const COMPLETED = "completed";

const BookItem = ({ book, onMove, inProgress }) => {
  if (!book || !book.title || !book.cover) {
    return (
      <Alert status="error" borderRadius="15px" mb="10px">
        <AlertIcon />
        Información del libro incompleta o función onMove no proporcionada.
      </Alert>
    );
  }

  return (
    <Card
      p="20px"
      w="100%"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb="10px"
      bg="white"
      borderWidth="1px"
      borderRadius="15px"
      boxShadow="lg"
      transition="all 0.3s ease-in-out"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
    >
      <Flex direction="row" align="center">
        <Box
          mr="15px"
          maxW="60px"
          maxH="90px"
          overflow="hidden"
          borderRadius="10px"
          boxShadow="lg"
        >
          <img
            src={book.cover}
            alt={book.title}
            style={{ width: "100%", height: "auto" }}
            onError={(e) => {
              e.target.src = "/default-cover.png";
              e.target.alt = "Imagen no disponible";
            }}
          />
        </Box>

        <Text fontSize="16px" fontWeight="bold" color="gray.800" letterSpacing="0.5px">
          {book.title || "Título no disponible"}
        </Text>
      </Flex>

      <Button
        colorScheme={inProgress ? "green" : "blue"}
        variant="solid"
        size="sm"
        onClick={() => {
          try {
            onMove(book);
          } catch (error) {
            console.error("Error al ejecutar onMove:", error);
            alert("Hubo un problema al mover el libro.");
          }
        }}
        _hover={{
          bg: inProgress ? "green.600" : "blue.600",
        }}
      >
        {inProgress ? "Lectura en curso" : "Completada"}
      </Button>
    </Card>
  );
};

const ListOfBooks = () => {
  const [booksInProgress, setBooksInProgress] = useState([]);
  const [completedBooks, setCompletedBooks] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      loadBookLists(user.uid);
    }
  }, [user]);

  const loadBookLists = async (uid) => {
    try {
      const { booksInProgress, completedBooks } = await getBooklist(uid);
      setBooksInProgress(booksInProgress);
      setCompletedBooks(completedBooks);
    } catch (error) {
      console.error("Error loading book lists:", error);
    }
  };

  const markAsCompleted = async (book) => {
    try {
      await updateBooklist(user.uid, book.id, COMPLETED);
      await loadBookLists(user.uid);
    } catch (error) {
      console.error("Error al mover el libro a completados:", error);
      alert("Hubo un problema al marcar el libro como completado.");
    }
  };

  const moveToInProgress = async (book) => {
    try {
      await updateBooklist(user.uid, book.id, IN_PROGRESS);
      await loadBookLists(user.uid);
    } catch (error) {
      console.error("Error al mover el libro a 'en progreso':", error);
      alert("Hubo un problema al mover el libro a 'en progreso'.");
    }
  };

  const totalBooks = booksInProgress.length + completedBooks.length;
  const completedPercentage = totalBooks === 0 ? 0 : (completedBooks.length / totalBooks) * 100;

  return (
    <Skeleton padding="5%" w="100%" h="100%" borderRadius="20px" isLoaded={true}>
      <Flex
        justify="space-between"
        align="center"
        mb="30px"
        direction={useBreakpointValue({ base: "column", md: "row" })}
        p={4}
      >
        <Heading
          fontWeight={700}
          fontSize={["24px", "30px", "36px"]}
          bgGradient="linear(to-r, teal.400, teal.600)"
          bgClip="text"
          mb={[4, 0]}
          transition="all 0.3s ease-in-out"
          _hover={{
            bgGradient: "linear(to-r, purple.400, pink.600)",
            bgClip: "text",
            transform: "scale(1.05)",
          }}
        >
          Mis Libros
        </Heading>
        <SlideFade in={true} offsetY="20px">
          <Text fontSize="18px" color="gray.600" maxW="500px" textAlign="center">
            Gestiona tus libros leídos y en progreso. ¡No pierdas el hilo de tu lectura!
          </Text>
        </SlideFade>
      </Flex>

      <Flex justifyContent="space-between" wrap="wrap">
        <Box
          bg="white"
          p="13px"
          borderRadius="20px"
          boxShadow="lg"
          maxW={["100%", "60%"]}
          flex="1"
          minW="250px"
          mb={[6, 0]}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Box mb="20px">
            <Heading fontSize="23px" mb="20px" color="teal.600" fontWeight="bold">
              Lecturas en curso
            </Heading>
            <Divider mb="20px" borderColor="teal.500" />
            <Box maxH="195px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {booksInProgress.length > 0 ? (
                  booksInProgress.map((book) => (
                    <BookItem key={book} book={book.book} onMove={markAsCompleted} inProgress />
                  ))
                ) : (
                  <Text fontSize="16px" color="gray.600">
                    No tienes libros en curso.
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>

          <Box>
            <Heading fontSize="23px" mb="20px" color="teal.600" fontWeight="bold">
              Lecturas completadas
            </Heading>
            <Divider mb="20px" borderColor="teal.500" />
            <Box maxH="195px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {completedBooks.length > 0 ? (
                  completedBooks.map((book) => (
                    <BookItem key={book} book={book.book} onMove={moveToInProgress} />
                  ))
                ) : (
                  <Text fontSize="16px" color="gray.600">
                    No tienes libros completados.
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>
        </Box>

        {/* Barra de estadísticas sin barra lateral extra */}
        <Box
          bg="white"
          p="10px"
          borderRadius="20px"
          boxShadow="lg"
          maxW={["100%", "35%"]}
          flex="1"
          minW="250px"
          height="200px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={[2, 0]}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Heading fontSize="18px" mb="10px" color="teal.600" fontWeight="bold">
            Progreso de Lectura
          </Heading>
          <CircularProgress
            value={completedPercentage}
            size="120px"
            thickness="10px"
            color="green.400"
            trackColor="gray.200"
            mb="10px"
            transition="all 0.3s ease-in-out"
          >
            <CircularProgressLabel>{Math.round(completedPercentage)}%</CircularProgressLabel>
          </CircularProgress>
          <Text fontSize="16px" color="gray.600">
            {completedBooks.length} de {totalBooks} libros completados
          </Text>
        </Box>
      </Flex>
    </Skeleton>
  );
};

export default ListOfBooks;





