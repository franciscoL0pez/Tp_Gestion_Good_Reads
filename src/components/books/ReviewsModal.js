import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useToast, // Importamos useToast de Chakra UI
} from "@chakra-ui/react";
import { Star1 } from "iconsax-react";
import { CloseIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { createReview, updateReview, deleteReview } from "@/services/reviews";
import { UserModal } from "@/services/users";
import { updateDoc } from "firebase/firestore";

const ReviewItem = ({ review, onDelete }) => {
  const [user] = useAuthState(auth);

  return (
    <Flex
      bg={"gray.100"}
      p={"15px"}
      borderRadius={"10px"}
      w={"100%"}
      position="relative"
    >
      <Avatar
        name={review?.user?.name + " " + review?.user?.lastName}
        src={review?.user?.photoURL}
      />
      <Flex direction={"column"} ml={"10px"} gap={"4px"}>
        <Text fontSize={"16px"} fontWeight={"bold"}>
          {review?.user?.name + " " + review?.user?.lastName}
        </Text>
        <Flex>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star1
              key={i}
              variant={"Bold"}
              size={"16"}
              opacity={i <= review?.rating ? 1 : 0.3}
              color={"gold"}
            />
          ))}
        </Flex>

        <Text fontSize={"14px"}>{review?.content}</Text>
      </Flex>

      {/* Esta cruz la muestro solo si es el usuario que escribio la reseña */}
      {user?.uid === review?.user?.uid && (
        <IconButton
          icon={<CloseIcon />}
          size="sm"
          position="absolute"
          top="5px"
          right="5px"
          aria-label="Eliminar reseña"
          colorScheme="red" // Cambiamos el color a rojo
          onClick={() => onDelete(review.id)} // Llamo a la fun para eliminar la res
        />
      )}
    </Flex>
  );
};

const ReviewEditor = ({ book, review, onEdit }) => {
  const [user] = useAuthState(auth);
  const [rating, setRating] = useState(review?.rating || 1);
  const [content, setContent] = useState(review?.content || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRating(review?.rating || 1);
    setContent(review?.content || "");
  }, [review]);

  const handleSave = async () => {
    setLoading(true);

    if (!review) {
      const newReview = await createReview(book.id, user.uid, rating, content);
      onEdit({
        ...book,
        reviews: [...book.reviews, newReview],
      });
    } else {
      const updatedReview = await updateReview(review.id, rating, content);
      onEdit({
        ...book,
        reviews: book.reviews.map((r) =>
          r.id === updatedReview.id ? updatedReview : r,
        ),
      });
    }

    setLoading(false);
  };

  return (
    <Flex w={"100%"} h={"100%"} direction={"column"} gap={"20px"}>
      <Flex gap={"10px"}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star1
            key={i}
            variant={i <= rating ? "Bold" : "Linear"}
            size={"50"}
            opacity={i <= rating ? 1 : 0.3}
            color={"gold"}
            onClick={() => setRating(i)}
            style={{ cursor: "pointer" }}
          />
        ))}
      </Flex>
      <Textarea
        placeholder={"Escribe tu reseña aquí"}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        h={"100%"}
        resize={"none"}
        w={"100%"}
      />
      <Flex w={"100%"} justify={"flex-end"} gap={"10px"}>
        <Button colorScheme={"green"} onClick={handleSave} isLoading={loading}>
          Guardar
        </Button>
      </Flex>
    </Flex>
  );
};

const ReviewsModal = ({ book, isOpen, onClose, onEdit }) => {
  const [user] = useAuthState(auth);
  const reviews = book.reviews || [];
  const toast = useToast();

  const isBookOwner = user?.uid === book?.author?.uid;

  const handleDelete = async (reviewId) => {
    const updatedReviews = reviews.filter((review) => review.id !== reviewId);
    await deleteReview(reviewId);
    onEdit({
      ...book,
      reviews: updatedReviews,
    });

    toast({
      title: "Reseña eliminada.",
      description: "Se eliminó la reseña correctamente.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"5xl"}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <ModalContent margin={"auto"} pb={"20px"}>
        <ModalCloseButton />
        <ModalHeader display={"flex"} alignItems={"center"}>
          <Text fontSize={"24px"}>{book?.title} </Text>
        </ModalHeader>
        <ModalBody display={"flex"} gap={"20px"}>
          {!isBookOwner && (
            <Flex w={"49%"}>
              <ReviewEditor
                review={reviews.find((review) => review.uid === user.uid)}
                book={book}
                onEdit={onEdit}
              />
            </Flex>
          )}
          <Flex
            w={isBookOwner ? "100%" : "49%"}
            direction={"column"}
            gap={"20px"}
            overflowY={"auto"}
            pr={"10px"}
            minH={"400px"}
          >
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onDelete={handleDelete}
              />
            ))}
            {!reviews.length && (
              <Box
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                h={"100%"}
              >
                <Text fontSize={"20px"} textAlign={"center"} mb={"60px"}>
                  Todavía no hay reseñas para este libro.
                </Text>
              </Box>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ReviewsModal;
