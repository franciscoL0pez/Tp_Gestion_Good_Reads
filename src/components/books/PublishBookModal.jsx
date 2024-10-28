import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { createBook } from "@/services/books";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";

const PublishBookModal = ({ isOpen, onClose, onCreate }) => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [plot, setPlot] = useState("");
  const [pdf, setPdf] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const handlePublish = async () => {
    if (!title || !plot || !pdf || !cover) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);

    const createdBook = await createBook(
      {
        uid: user.uid,
        title,
        plot,
      },
      pdf,
      cover,
    );

    if (createdBook) {
      toast({
        title: "Libro publicado",
        description: "Tu libro ha sido publicado exitosamente",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      onCreate(createdBook);
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Hubo un error al publicar tu libro",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent margin={"auto"}>
        <ModalCloseButton />
        <ModalHeader>Publicar Libro</ModalHeader>
        <ModalBody display={"flex"} flexDirection={"column"} gap={"10px"}>
          <Input
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Sinopsis"
            value={plot}
            onChange={(e) => setPlot(e.target.value)}
            h={"200px"}
            resize={"none"}
          />
          <Box>
            <Text>Sube el archivo PDF de tu libro</Text>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              p={"5px"}
            />
          </Box>
          <Box>
            <Text>Sube la portada de tu libro</Text>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setCover(e.target.files[0])}
              p={"5px"}
            />
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handlePublish}
            isLoading={loading}
          >
            Publicar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PublishBookModal;
