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
  Flex,
  Box,
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
            {book?.author?.name + " " + book?.author?.lastName + " - " + book?.year}
          </Text>
        </ModalHeader>
        <ModalBody display={"flex"} gap={"40px"} flexDirection={"column"}>
          <Flex gap="40px">
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
          </Flex>
          <Flex ml="2" gap="10px">
              {book?.genders?.map(gender => {
                return <Box py="4px" px="8px" bg="gray.200" borderRadius="8px">{gender}</Box>
                })
                }
          </Flex>
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
