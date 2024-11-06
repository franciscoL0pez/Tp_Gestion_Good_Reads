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
  Box
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { EditIcon, useDisclosure } from "@chakra-ui/icons";
import PublishBookModal from "@/components/books/PublishBookModal";


import { Star1 } from "iconsax-react";
import ReviewsModal from "@/components/books/ReviewsModal";
import { useState } from "react";

const ViewBookModal = ({ isOpen, onClose, book, onEdit, onAddToReadingList, onRemoveFromReadingList }) => {
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
    if (!isBookAdded) {
      setIsBookAdded(true);
      onAddToReadingList(book); 
      toast({
        title: "Libro añadido",
        description: `${book?.title} ha sido añadido a tu lista de lecturas.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRemoveFromReadingList = () => {
    if (isBookAdded) {
      setIsBookAdded(false);
      onRemoveFromReadingList(book); 
      toast({
        title: "Libro eliminado",
        description: `${book?.title} ha sido eliminado de tu lista de lecturas.`,
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const {
    isOpen: isReviewsModalOpen,
    onOpen: openReviewsModal,
    onClose: closeReviewsModal,
  } = useDisclosure();

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
              {book?.genders?.map(gender => {
                return <Box py="4px" px="8px" bg="gray.200" borderRadius="8px">{gender}</Box>
                })
                }
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="gray" mr={3} onClick={openReviewsModal}>
            Ver reseñas
          </Button>

          {isBookAdded ? (
            <Button
              onClick={handleRemoveFromReadingList} //Lo quito de la lista
              colorScheme="red" 
            >
              Quitar de lista de lecturas
            </Button>
          ) : (
            <Button
              onClick={handleAddToReadingList}
              colorScheme="gray"
            >
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


