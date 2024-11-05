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
import { Star1 } from "iconsax-react";
import ReviewsModal from "@/components/books/ReviewsModal";

const ViewBookModal = ({ isOpen, onClose, book, onEdit }) => {
  const [user] = useAuthState(auth);

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
          <Button colorScheme="gray" mr={3} onClick={openReviewsModal}>
            Ver reseñas
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
      <ReviewsModal
        book={book}
        isOpen={isReviewsModalOpen}
        onClose={closeReviewsModal}
        onEdit={onEdit}
      />
    </Modal>
  );
};

export default ViewBookModal;
