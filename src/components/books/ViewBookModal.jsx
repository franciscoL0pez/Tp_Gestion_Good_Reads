import {
  Button,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { EditIcon, useDisclosure } from "@chakra-ui/icons";
import PublishBookModal from "@/components/books/PublishBookModal";
//Creo un estado para poder cambiarlo cuando añado el libro
import { useState } from "react";

const ViewBookModal = ({ isOpen, onClose, book, onEdit }) => {
  const [user] = useAuthState(auth);
  const [isBookAdded, setIsBookAdded] = useState(false);
  const isBookOwner = user?.uid === book?.author?.uid;

  const {
    isOpen: isEditBookModalOpen,
    onOpen: openEditBookModal,
    onClose: closeEditBookModal,
  } = useDisclosure();

  const toast = useToast();

  const handleAddToReadingList = () => {
    setIsBookAdded(true);
    toast({
      title: "Libro añadido",
      description: `${book?.title} ha sido añadido a tu lista de lecturas.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });
  };


  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent margin={"auto"} pb={"20px"}>
        <ModalCloseButton />
        <ModalHeader display={"flex"} flexDirection={"column"}>
          <Text>
            {book?.title}
            {isBookOwner && (
              <IconButton
                aria-label={"Editar"}
                size={"sm"}
                variant={"ghost"}
                ml={"5px"}
                onClick={openEditBookModal}
              >
                <EditIcon />
              </IconButton>
            )}
          </Text>
          <Text
            fontSize={"20px"}
            color={"gray.500"}
            display={"inline"}
            fontWeight={"normal"}
            fontStyle={"italic"}
          >
            {book?.author?.name + " " + book?.author?.lastName}
          </Text>
        </ModalHeader>
        <ModalBody display={"flex"} gap={"40px"}>
          <img
            src={book?.cover}
            alt={book?.title}
            style={{
              width: "200px",
              height: "300px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
          <Text fontSize={"16px"} textAlign={"justify"}>
            {book?.plot}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cerrar
          </Button>
          <Button
            colorScheme="green"
            mr={3}
            onClick={() => window.open(book?.pdf, "_blank")}
          >
            Descargar
          </Button>
          <Button
            onClick={handleAddToReadingList}
            colorScheme="gray"
            isDisabled={isBookAdded}
          >
            {isBookAdded ? "Añadido" : "Añadir a lista de lecturas"}
          </Button>
        </ModalFooter>
      </ModalContent>
      <PublishBookModal
        isOpen={isEditBookModalOpen}
        onClose={closeEditBookModal}
        selectedBook={book}
        onEdit={onEdit}
      />
    </Modal>
  );
};

export default ViewBookModal;
