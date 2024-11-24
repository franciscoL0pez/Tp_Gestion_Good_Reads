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
import { createReview, updateReview, getReviews, deleteReview , createComment, getComments, deleteComment,commentEditor,  } from "@/services/reviews";
import { UserModal } from "@/services/users";
import { updateDoc } from "firebase/firestore";

const ReviewItem = ({ review, onDelete, onCommentAdded }) => {
  const [user] = useAuthState(auth);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newComment, setNewComment] = useState(""); // Estado para el nuevo comentario
  const [loadingCommentCreation, setLoadingCommentCreation] = useState(false); // Estado de carga para crear comentario

  const fetchComments = async (reviewId) => {
    setLoadingComments(true);
    const fetchedComments = await getComments(reviewId);
    setComments(fetchedComments);
    setLoadingComments(false);
  };

  const handleToggleComments = async () => {
    setShowComments(!showComments);
  
    if (!showComments) {
      // Si se va a mostrar los comentarios, cargarlos
      setLoadingComments(true);
      try {
        const fetchedComments = await getComments(review.id); // Asume que tienes una función que obtiene los comentarios
        setComments(fetchedComments);
      } catch (error) {
        console.error("Error loading comments:", error);
      } finally {
        setLoadingComments(false);
      }
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Validar que el comentario no esté vacío

    setLoadingCommentCreation(true);
    const createdComment = await createComment(review.id, user.uid, newComment);
    setComments([...comments, createdComment]); // Agregar el nuevo comentario al estado
    setNewComment(""); // Limpiar el campo del comentario
    onCommentAdded(createdComment); // Llamar a la función onCommentAdded si se pasa

    setLoadingCommentCreation(false);
  };

  const handleDeleteComment = async (commentID) => {
    await deleteComment(commentID);
    setLoadingComments(true);
    try {
      const fetchedComments = await getComments(review.id);
      setComments(fetchedComments);
    } catch (error) { 
      console.error("Error loading comments:", error);
    } finally {
      setLoadingComments(false);
    }
    
  };

  return (
    <Flex bg={"gray.100"} p={"15px"} borderRadius={"10px"} w={"100%"} position="relative">
      <Avatar name={review?.user?.name + " " + review?.user?.lastName} src={review?.user?.photoURL} />
      <Flex direction={"column"} ml={"10px"} gap={"4px"}>
        <Text fontSize={"16px"} fontWeight={"bold"}>{review?.user?.name + " " + review?.user?.lastName}</Text>
        <Flex>
          {[1, 2, 3, 4, 5].map((i) => (
            <Star1 key={i} variant={"Bold"} size={"16"} opacity={i <= review?.rating ? 1 : 0.3} color={"gold"} />
          ))}
        </Flex>
        <Text fontSize={"14px"}>{review?.content}</Text>
  
        <Button variant="link" onClick={handleToggleComments} colorScheme="blue">
          {showComments ? "Ocultar comentarios" : "Ver comentarios"}
        </Button>
  
        {showComments && (
          <Box mt={3}>
            {loadingComments ? (
              <Text>Cargando comentarios...</Text>
            ) : comments.length ? (
              comments.map((comment) => (
                <Flex 
                  key={comment.id} 
                  direction="column" 
                  p={2} 
                  borderWidth={1} 
                  borderRadius="8px" 
                  mb={2} 
                  position="relative" // Necesario para el posicionamiento absoluto del botón
                >
                  <Text fontWeight="bold">{comment.user.name}</Text>
                  <Text>{comment.content}</Text>
  
                  {user?.uid === comment.uid && (
                    <IconButton
                      icon={<CloseIcon />}
                      size="sm"
                      position="absolute"
                      top="5px" // Ajusta la posición según lo que necesites
                      right="5px" // Ajusta la posición según lo que necesites
                      aria-label="Eliminar comentario"
                      colorScheme="red"
                      onClick={() => handleDeleteComment(comment.id)} 
                    />
                  )}
                </Flex>
              ))
            ) : (
              <Text>No hay comentarios aún.</Text>
            )}
          </Box>
        )}
  
        {/* Campo para agregar un nuevo comentario */}
        {user && (
          <Flex mt={3} direction="column">
            <Textarea
              placeholder="Escribe tu comentario aquí"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              h={"100%"}
              resize={"none"}
              w={"100%"}
            />
            <Button 
              mt={2} 
              colorScheme="blue" 
              onClick={handleAddComment} 
              isLoading={loadingCommentCreation}
            >
              Comentar
            </Button>
          </Flex>
        )}
      </Flex>
  
      {user?.uid === review?.user?.uid && (
        <IconButton
          icon={<CloseIcon />}
          size="sm"
          position="absolute"
          top="5px"
          right="5px"
          aria-label="Eliminar reseña"
          colorScheme="red"
          onClick={() => onDelete(review.id)} 
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

  const handleCommentAdded = (newComment) => {
    const updatedReviews = reviews.map((review) => {
      // Asegurarse de que cada reseña tenga un array de comentarios
      const updatedComments = review.comments ? [...review.comments, newComment] : [newComment];
      
      return review.id === newComment.reviewId
        ? { ...review, comments: updatedComments }
        : review;
    });
    
    onEdit({ ...book, reviews: updatedReviews });
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={"5xl"} scrollBehavior={"inside"}>
      <ModalOverlay />
      <ModalContent margin={"auto"} pb={"20px"}>
        <ModalCloseButton />
        <ModalHeader display={"flex"} alignItems={"center"}>
          <Text fontSize={"24px"}>{book?.title}</Text>
        </ModalHeader>
        <ModalBody display={"flex"} gap={"20px"}>
          {!isBookOwner && (
            <Flex w={"49%"}>
              <ReviewEditor review={reviews.find((review) => review.uid === user.uid)} book={book} onEdit={onEdit} />
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
              <ReviewItem key={review.id} review={review} onDelete={handleDelete} onCommentAdded={handleCommentAdded} />
            ))}
            {!reviews.length && (
              <Box display={"flex"} alignItems={"center"} justifyContent={"center"} h={"100%"}>
                <Text fontSize={"20px"} textAlign={"center"} mb={"60px"}>
                  Todavía no hay reseñas para este libro.
                </Text>
              </Box>
            )}
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};


export default ReviewsModal;
