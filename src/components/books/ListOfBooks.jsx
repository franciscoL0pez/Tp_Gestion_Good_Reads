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
// Importamos los servicios
import { getBooklist, updateBooklist } from "@/services/bookList";
const IN_PROGRESS = "in_progress";
const COMPLETED = "completed";

const BookItem = ({ book, onMove, inProgress }) => {
 
  if (!book || !book.title || !book.cover ) {
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
        {/* Imagen del libro */}
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
              e.target.src = "/default-cover.png"; // Imagen por defecto si falla la carga
              e.target.alt = "Imagen no disponible";
            }}
          />
        </Box>

        {/* Título del libro */}
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
            onMove(book); // Llamada a la función pasada como prop
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
  
      console.log(`Libro "${book.title}" marcado como completado.`);
    } catch (error) {
      console.error("Error al mover el libro a completados:", error);
      alert("Hubo un problema al marcar el libro como completado.");
    }
  };
  
  const moveToInProgress = async (book) => {
    try {
      await updateBooklist(user.uid, book.id, IN_PROGRESS);
      await loadBookLists(user.uid);
  
      console.log(`Libro "${book.title}" movido a "en progreso".`);
    } catch (error) {
      console.error("Error al mover el libro a 'en progreso':", error);
      alert("Hubo un problema al mover el libro a 'en progreso'.");
    }
  };
  
  
  // Calcular las estadísticas
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
        {/* List of Books */}
        <Box
          bg="white"
          p="20px"
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
          <Box mb="30px">
            <Heading fontSize="22px" mb="15px" color="teal.600" fontWeight="bold">
              Lecturas en curso
            </Heading>
            <Divider mb="15px" borderColor="teal.500" />
            <Box maxH="300px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {booksInProgress.length > 0 ? (
             
                  booksInProgress.map((book) => (
                    
                     
                    <BookItem key = {book} book = {book.book} onMove={markAsCompleted} inProgress  />
                    
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
            <Heading fontSize="22px" mb="15px" color="teal.600" fontWeight="bold">
              Lecturas completadas
            </Heading>
            <Divider mb="15px" borderColor="teal.500" />
            <Box maxH="300px" overflowY="auto">
              <VStack spacing={4} align="stretch">
                {completedBooks.length > 0 ? (
                  
                  completedBooks.map((book) => (
                   
                    <BookItem key={book} book={book.book} onMove ={moveToInProgress}  />
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

        {/* Book Stats */}
        <Box
          bg="white"
          p="20px"
          borderRadius="20px"
          boxShadow="lg"
          maxW={["100%", "35%"]}
          flex="1"
          minW="250px"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mb={[6, 0]}
          transition="all 0.3s ease-in-out"
          _hover={{
            transform: "scale(1.02)",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Heading fontSize="22px" mb="15px" color="teal.600" fontWeight="bold">
            Estadísticas de Lecturas
          </Heading>
          <Divider mb="15px" borderColor="teal.500" />

          {/* Circular Progress Bar */}
          <Box display="flex" flexDirection="column" alignItems="center">
            <CircularProgress value={completedPercentage} size="120px" color="green.400" thickness="8px" transition="all 0.3s ease-in-out">
              <CircularProgressLabel fontSize="20px" fontWeight="bold">
                {completedPercentage.toFixed(0)}%
              </CircularProgressLabel>
            </CircularProgress>
            <Text mt="10px" fontSize="16px" color="gray.600">
              Libros completados
            </Text>
            <Text fontSize="14px" color="gray.500">
              {completedBooks.length} de {totalBooks} libros
            </Text>
          </Box>
        </Box>
      </Flex>
    </Skeleton>
  );
};

export default ListOfBooks;




