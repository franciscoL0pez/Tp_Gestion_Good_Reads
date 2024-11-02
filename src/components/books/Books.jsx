"use client";
import { Button, Card, Flex, Heading, Input, Skeleton, Text } from "@chakra-ui/react";
import { useUserData } from "@/hooks/useUserData";
import { useDisclosure } from "@chakra-ui/icons";
import PublishBookModal from "@/components/books/PublishBookModal";
import { useBooks } from "@/hooks/useBooks";
import ViewBookModal from "@/components/books/ViewBookModal";
import { useState } from "react";

const BookCard = ({ book, onEdit }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Card
      onClick={onOpen}
      w={"250px"}
      h={"350px"}
      p={"10px"}
      transition={"all 0.3s ease"}
      _hover={{
        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.2)",
        cursor: "pointer",
      }}
    >
      <Flex direction={"column"} gap={"5px"}>
        <Text fontSize={"16px"} noOfLines={1}>
          {book.title}
        </Text>
        <img
          src={book.cover}
          alt={book.title}
          style={{
            width: "100%",
            height: "300px",
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
  const [searchTerm, setSearchTerm] = useState("");

  const loading = userLoading || booksLoading;

  const isAuthor = userData?.isAuthor;

  const {
    isOpen: isPublishBookModalOpen,
    onOpen: openPublishBookModal,
    onClose: closePublishBookModal,
  } = useDisclosure();

  // Filtrar libros basados en el término de búsqueda
  const filteredBooks = books?.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Skeleton
      padding={"3%"}
      w={"100%"}
      h={"100%"}
      isLoaded={!loading}
      borderRadius={"20px"}
    >
      <Flex justify={"space-between"} align={"center"}>
        <Heading fontWeight={400} fontSize={"40px"}>
          Libros
        </Heading>
        {isAuthor && (
          <Button colorScheme={"green"} onClick={openPublishBookModal}>
            Publicar Libro
          </Button>
        )}
      </Flex>
      <Flex mt={"20px"} gap={"20px"} align={"center"}>
        {/* Caja de búsqueda */}
        <Input
          placeholder="Buscar libro por título..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          width={"300px"}
        />
      </Flex>
      <PublishBookModal
        isOpen={isPublishBookModalOpen}
        onClose={closePublishBookModal}
        onCreate={addBook}
      />
      <Flex mt={"20px"} gap={"20px"} wrap={"wrap"} overflowY={"auto"} h={"90%"}>
        {filteredBooks?.map((book) => (
          <BookCard key={book.id} book={book} onEdit={editBook} />
        ))}
      </Flex>
    </Skeleton>
  );
};

export default Books;

