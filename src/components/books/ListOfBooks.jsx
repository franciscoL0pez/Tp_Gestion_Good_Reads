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
      p={"5px"} 
      w={"100%"}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={"10px"} 
      bg={"gray.50"}
      borderWidth="1px"
      borderRadius={"10px"}
      _hover={{ boxShadow: "lg", bg: "gray.100" }}
      transition="all 0.3s ease"
    >
      <HStack spacing={2}>
        <Image
          src={book.image}
          alt={book.title}
          boxSize="50px" 
          objectFit="cover"
          borderRadius={"5px"}
        />
        <Text fontSize={"14px"} fontWeight="600" color="gray.700" noOfLines={1}>
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
    { id: 1, title: "El Alquimista", image: "ElAlquimista.png" },
    { id: 2, title: "1984", image: "1984.png" },
    // Agrega más libros para probar el scroll
    { id: 3, title: "Cien años de soledad", image: "fotosPrueba/Cien_años_de_soledad.png" },
    { id: 4, title: "El Principito", image: "fotosPrueba/ElPrincipito.png" },
    { id: 5, title: "Don Quijote de la Mancha", image: "fotosPrueba/DonQuijote.png" },
    { id: 6, title: "Crimen y Castigo", image: "fotosPrueba/CrimenyCastigo.png" },
    // Más libros...
  ]);
  const [completedBooks, setCompletedBooks] = useState([
    { id: 7, title: "Orgullo y Prejuicio", image: "fotosPrueba/OrgullosyPrejuicio.png" },
    { id: 8, title: "Moby Dick", image: "fotosPrueba/MobyDick.png" },
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
        <Heading fontWeight={500} fontSize={"24px"} color="dark"> {/* Disminuir el tamaño del encabezado */}
          Mis libros
        </Heading>
      </Flex>

      <Flex justifyContent="flex-start" wrap="wrap" maxW="35%"> {/* Cambiar a '35%' */}
        <Box bg={"white"} p={"15px"} borderRadius={"15px"} boxShadow="lg" maxW={"90%"} flex="1" minW={"200px"}> {/* Ajustar el ancho máximo y mínimo */}
          <Box mb={"30px"}>
            <Heading fontSize={"20px"} mb={"20px"} color="teal.500"> {/* Disminuir el tamaño del encabezado */}
              Leyendo ahora
            </Heading>
            <Divider mb={"15px"} />
            <Box maxH="300px" overflowY="auto"> {/* Agregar barra de desplazamiento */}
              <VStack spacing={2} align="stretch">
                {filteredInProgress.length > 0 ? (
                  filteredInProgress.map((book) => (
                    <BookItem key={book.id} book={book} onMove={markAsCompleted} inProgress />
                  ))
                ) : (
                  <Text fontSize={"14px"} color="gray.600">
                    No tienes libros en curso.
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>

          <Box>
            <Heading fontSize={"20px"} mb={"20px"} color="teal.500"> {/* Disminuir el tamaño del encabezado */}
              Lecturas completadas
            </Heading>
            <Divider mb={"15px"} />
            <Box maxH="300px" overflowY="auto"> {/* Agregar barra de desplazamiento */}
              <VStack spacing={2} align="stretch">
                {filteredCompleted.length > 0 ? (
                  filteredCompleted.map((book) => (
                    <BookItem key={book.id} book={book} onMove={moveToInProgress} />
                  ))
                ) : (
                  <Text fontSize={"14px"} color="gray.600">
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
        />
      )}
    </Skeleton>
  );
};

export default BooksList;










