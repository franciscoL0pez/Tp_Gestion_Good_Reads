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
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { EditIcon, useDisclosure } from "@chakra-ui/icons";
import PublishBookModal from "@/components/books/PublishBookModal";

const ViewBookModal = ({ isOpen, onClose, book, onEdit }) => {
  const [user] = useAuthState(auth);

  const isBookOwner = user?.uid === book?.author?.uid;

  const {
    isOpen: isEditBookModalOpen,
    onOpen: openEditBookModal,
    onClose: closeEditBookModal,
  } = useDisclosure();

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
        <ModalBody>
          <Text>
            Año de Publicación: {book?.year}
          </Text>
          <Text>
            Genero: {book?.gender}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cerrar
          </Button>
          <Button
            colorScheme="green"
            onClick={() => window.open(book?.pdf, "_blank")}
          >
            Descargar
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
