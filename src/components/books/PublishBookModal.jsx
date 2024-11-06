import {
  Box,
  Button,
  Input,
  Link,
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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,

  
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { createBook, updateBook } from "@/services/books";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import Select from 'react-select';
import { gendersOptions } from "@/data/genders";

const PublishBookModal = ({
  isOpen,
  onClose,
  onCreate,
  selectedBook,
  onEdit,
}) => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState(selectedBook?.title || "");
  const [plot, setPlot] = useState(selectedBook?.plot || "");
  const [genders, setGenders] = useState(selectedBook?.genders?.map(gender => ({label: gender, value: gender})) || []);
  const [year, setYear] = useState(selectedBook?.year || "");
  const [pdf, setPdf] = useState(null);
  const [cover, setCover] = useState(null);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  useEffect(() => {
    if (selectedBook) {
      setTitle(selectedBook?.title || "");
      setPlot(selectedBook?.plot || "");
      setGenders(selectedBook?.genders?.map(gender => ({label: gender, value: gender})) || [])
      setYear(selectedBook?.year || "");
    }
  }, [selectedBook])


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
        year,
        genders: genders.map(gender => gender.value),
      },
      pdf,
      cover
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

  const handleEdit = async () => {
    if (!title || !plot) {
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

    const updatedBook = await updateBook(
      selectedBook.id,
      {
        uid: user.uid,
        title,
        plot,
        genders:genders.map(gender => gender.value),
        year,
      },
      cover,
      pdf
    );

    if (updatedBook) {
      toast({
        title: "Libro actualizado",
        description: "Tu libro ha sido actualizado exitosamente",
        status: "success",
        duration: 9000,
        isClosable: true,
      });

      onEdit(updatedBook);
    } else {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar tu libro",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    onClose();
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!selectedBook) {
      await handlePublish();
    } else {
      await handleEdit();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
      <ModalOverlay />
      <ModalContent margin={"auto"}>
        <ModalCloseButton />
        <ModalHeader>
          {selectedBook ? "Editar libro" : "Publicar libro"}
        </ModalHeader>
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

          <Select
            placeholder="Géneros"
            isMulti
            options={gendersOptions}
            onChange={setGenders}
            value={genders}
          />
          <Box>
            <Text> Año:</Text>
            <NumberInput defaultValue={2024} max={2024} onChange={setYear}>
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
          <Box>
            <Text>
              Sube el archivo PDF de tu libro
              {selectedBook?.pdf && (
                <Link
                  href={selectedBook?.pdf}
                  target="_blank"
                  rel="noreferrer"
                  ml={"5px"}
                  color={"blue.500"}
                >
                  (Ver PDF actual)
                </Link>
              )}
            </Text>
            <Input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdf(e.target.files[0])}
              p={"5px"}
            />
          </Box>
          <Box>
            <Text>
              Sube la portada de tu libro
              {selectedBook?.cover && (
                <Link
                  href={selectedBook?.cover}
                  target="_blank"
                  rel="noreferrer"
                  ml={"5px"}
                  color={"blue.500"}
                >
                  (Ver portada actual)
                </Link>
              )}
            </Text>
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
            onClick={handleSubmit}
            isLoading={loading}
          >
            {selectedBook ? "Actualizar" : "Publicar"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PublishBookModal;
