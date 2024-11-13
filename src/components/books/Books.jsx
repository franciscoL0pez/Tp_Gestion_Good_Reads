"use client";
import {
  Button,
  Card,
  Flex,
  Heading,
  Input,
  Skeleton,
  Text,
  useDisclosure,
  Box,
  IconButton,
} from "@chakra-ui/react";
import { useUserData } from "@/hooks/useUserData";
import { useBooks } from "@/hooks/useBooks";
import { useState } from "react";
import PublishBookModal from "@/components/books/PublishBookModal";
import ViewBookModal from "@/components/books/ViewBookModal";
import { FaSearch } from "react-icons/fa"; // Icono de búsqueda

const BookCard = ({ book, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card
      onClick={onOpen}
      w={"250px"}
      h={"380px"}
      p={"15px"}
      bg={"#f9f9f9"}
      borderRadius={"15px"}
      boxShadow={"0px 4px 20px rgba(0, 0, 0, 0.1)"}
      transition={"all 0.3s ease"}
      _hover={{
        boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.15)",
        transform: "scale(1.05)",
        cursor: "pointer",
      }}
    >
      <Flex direction={"column"} gap={"10px"} align={"center"}>
        <Text fontSize={"16px"} fontWeight={"bold"} noOfLines={1} textAlign="center">
          {book.title}
        </Text>
        <Text fontSize={"14px"} noOfLines={1} fontWeight="normal" color="gray.600">
          {book.genders?.[0] || "Sin género"}
        </Text>
        <img
          src={book.cover}
          alt={book.title}
          style={{
            width: "100%",
            height: "200px",
            objectFit: "cover",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
      </Flex>
      <ViewBookModal
        isOpen={isOpen}
        onClose={onClose}
        book={book}
        onEdit={onEdit}
      />
    </Card>
  );
};

const Books = () => {
  const { userData, loading: userLoading } = useUserData();
  const { books, loading: booksLoading, addBook, editBook } = useBooks();
  const [searchTitle, setSearchTitle] = useState("");

  const loading = userLoading || booksLoading;
  const isAuthor = userData?.isAuthor;

  const {
    isOpen: isPublishBookModalOpen,
    onOpen: openPublishBookModal,
    onClose: closePublishBookModal,
  } = useDisclosure();

  // Filtrar libros basados en el título
  const filteredBooks = books?.filter((book) =>
    book.title.toLowerCase().includes(searchTitle.toLowerCase())
  );

  return (
    <Skeleton
      padding={"3%"}
      w={"100%"}
      h={"100%"}
      isLoaded={!loading}
      borderRadius={"20px"}
      borderColor={"#E2E8F0"}
    >
      <Flex justify={"space-between"} align={"center"} mb={"20px"}>
        <Heading fontWeight={500} fontSize={"36px"} color={"#2F855A"}>
          Libros
        </Heading>
        {isAuthor && (
          <Button
            colorScheme={"green"}
            size="lg"
            onClick={openPublishBookModal}
            _hover={{
              bg: "#38a169",
              transform: "scale(1.05)",
              boxShadow: "lg",
            }}
          >
            Publicar Libro
          </Button>
        )}
      </Flex>

      {/* Barra de búsqueda */}
      <Flex mt={"20px"} gap={"10px"} align={"center"} mb={"20px"}>
        <Input
          placeholder="Buscar libro por título..."
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
          width={"300px"}
          borderRadius={"50px"}
          boxShadow={"sm"}
          _focus={{
            boxShadow: "md",
            borderColor: "#48BB78",
          }}
        />
        <IconButton
          icon={<FaSearch />}
          aria-label="Buscar"
          colorScheme={"green"}
          size="lg"
          borderRadius={"50%"}
          onClick={() => {}}
          _hover={{
            transform: "scale(1.1)",
            boxShadow: "lg",
          }}
        />
      </Flex>

      <PublishBookModal
        isOpen={isPublishBookModalOpen}
        onClose={closePublishBookModal}
        onCreate={addBook}
      />

      <Flex mt={"20px"} gap={"20px"} wrap={"wrap"} justify={"center"} overflowY={"auto"} h={"80%"}>
        {filteredBooks?.map((book) => (
          <BookCard key={book.id} book={book} onEdit={editBook} />
        ))}
      </Flex>
    </Skeleton>
  );
};

export default Books;
