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
  Flex,
  Box,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";

import { EditIcon, useDisclosure } from "@chakra-ui/icons";
import PublishBookModal from "@/components/books/PublishBookModal";

import { Star1 } from "iconsax-react";
import ReviewsModal from "@/components/books/ReviewsModal";
import { useState, useEffect } from "react";
import {
  createBooklist,
  deleteLecture,
  getLectureByBookId,
 
} from "@/services/bookList"; // Importamos los servicios


const useLecture = (uid, bookId) => {
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLecture = async () => {
      const lecture = await getLectureByBookId(uid, bookId)
      setLecture(lecture);
      setLoading(false);
    };

    if (uid && bookId) {
      setLoading(true);
      fetchLecture();
    }
  }, [uid, bookId]);

  return {
    lecture, 
    loading,
    setLecture
  };
};


const ViewBookModal = ({ isOpen, onClose, book, onEdit }) => {
  const [user] = useAuthState(auth);

  
  const { lecture, loading: lectureLoading, setLecture } = useLecture(user?.uid, book?.id);
  const isBookAdded = lecture !== null;
  const toast = useToast();

  const isBookOwner = user?.uid === book?.author?.uid;

  const {
    isOpen: isEditBookModalOpen,
    onOpen: openEditBookModal,
    onClose: closeEditBookModal,
  } = useDisclosure();

  const {
    isOpen: isReviewsModalOpen,
    onOpen: openReviewsModal,
    onClose: closeReviewsModal,
  } = useDisclosure();


  const handleAddToReadingList = async ({ book }) => {


    if (!isBookAdded && user) {
      console.log("Entro al handler list.");

      const booklist = await createBooklist(user.uid, book.id);

      if (booklist) {
        setLecture(booklist);
        toast({
          title: "Lista creada",
          description: `${book?.title} ha sido añadido como tu primera lectura.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });

  
      } else {
        toast({
          title: "Error",
          description: "No se pudo crear tu lista de .",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  const handleRemoveFromReadingList = async ({book}) => {
    if (isBookAdded && user) {
      
      const deleted = await deleteLecture(user.uid, book.id);
    
      if(!deleted){
        toast({
          title: "Error",
          description: "No se eliminar la lectura.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return
      }

      setLecture(null);

      toast({
        title: "Libro eliminado",
        description: `${book?.title} ha sido eliminado de tu lista de lecturas.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const averageRating =
    book?.reviews.reduce((acc, review) => acc + review.rating, 0) /
    book?.reviews.length;

  const ratingString = isNaN(averageRating)
    ? "Sin calificaciones"
    : averageRating.toFixed(1);

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
            display={"flex"}
            fontWeight={"normal"}
            fontStyle={"italic"}
            alignItems={"center"}
          >
            {book?.author?.name + " " + book?.author?.lastName} - {ratingString}{" "}
            <Star1
              size="16"
              variant={"Bold"}
              style={{
                marginLeft: "5px",
              }}
            />
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
            {book?.genders?.map((gender) => (
              <Box
                key={gender}
                py="4px"
                px="8px"
                bg="gray.200"
                borderRadius="8px"
              >
                {gender}
              </Box>
            ))}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={openReviewsModal}>
            Ver reseñas
          </Button>

          {isBookAdded ? (
            <Button onClick={() => handleRemoveFromReadingList({ book })} colorScheme="red" isLoading={lectureLoading}>
              Quitar de lista de lecturas
            </Button>
          ) : (
            <Button onClick={() => handleAddToReadingList({ book })} colorScheme="gray" isLoading={lectureLoading}>
              Añadir a lista de lecturas
            </Button>
          )}

          <Button
            colorScheme="green"
            ml={3}
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

      <ReviewsModal
        book={book}
        isOpen={isReviewsModalOpen}
        onClose={closeReviewsModal}
        selectedBook={book}
        onEdit={onEdit}
      />
    </Modal>
  );
};

export default ViewBookModal;




