import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const ViewBookModal = ({ isOpen, onClose, book }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"3xl"}>
      <ModalOverlay />
      <ModalContent margin={"auto"} pb={"20px"}>
        <ModalCloseButton />
        <ModalHeader display={"flex"} flexDirection={"column"}>
          {book?.title}{" "}
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
            onClick={() => window.open(book?.pdf, "_blank")}
          >
            Descargar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ViewBookModal;
