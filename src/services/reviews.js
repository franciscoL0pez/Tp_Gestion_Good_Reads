import { db } from "@/services/firebase";
import {
  addDoc,
  collection,
  deleteDoc, // Esto no se bien que es xd, pero se supone que sirve para eliminar esto
  doc,
  getDocs,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getUser } from "@/services/users";
import { sendReviewNotification } from "@/services/notifications";

const createReview = async (bookId, uid, rating, content, userName) => {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      bookId,
      uid,
      rating,
      content,
    });
    const reviewId = reviewRef.id;

    const user = await getUser(uid);
    await sendReviewNotification(uid, userName);

    return {
      id: reviewId,
      bookId,
      uid,
      rating,
      content,
      user,
    };
  } catch (e) {
    console.error("Error adding document:", e);
    return null;
  }
};


const updateReview = async (reviewId, rating, content) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await updateDoc(reviewRef, {
      rating,
      content,
    });

    const review = await getDoc(reviewRef);

    const user = await getUser(review.data().uid);

    return {
      id: reviewId,
      ...review.data(),
      rating,
      content,
      user,
    };
  } catch (e) {
    console.error("Error updating document:", e);
    return null;
  }
};

const getReviews = async (bookId) => {
  try {
    const collectionRef = collection(db, "reviews");
    const q = query(collectionRef, where("bookId", "==", bookId));

    const querySnapshot = await getDocs(q);

    const reviews = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    return await Promise.all(
      reviews.map(async (review) => {
        const user = await getUser(review.uid);
        return {
          id: review.id,
          ...review,
          user,
        };
      }),
    );
  } catch (e) {
    console.error("Error getting document:", e);
    return [];
  }
};


//Creo un delete para eliminar la reseña
const deleteReview = async (reviewId) => {
  try {
    const reviewRef = doc(db, "reviews", reviewId);
    await deleteDoc(reviewRef);
    return true; 
  } catch (e) {
    console.error("Error deleting document:", e);
    return false; 
  }
};


/// ----------- Comments --------------- ///
const createComment = async (reviewId, uid, content) => {
  try {
    const commentRef = await addDoc(collection(db, "comments"), {
      reviewId,
      uid,
      content,
      createdAt: new Date(), // Fecha de creación
    });
    const commentId = commentRef.id;

    const user = await getUser(uid);

    return {
      id: commentId,
      reviewId,
      uid,
      content,
      user,
      createdAt: new Date(), // Fecha de creación
    };
  } catch (e) {
    console.error("Error adding document:", e);
    return null;
  }
};


const updateComment = async (commentId, newContent) => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await updateDoc(commentRef, {
      content: newContent,
    });

    const comment = await getDoc(commentRef);

    const user = await getUser(comment.data().uid);

    return {
      id: commentId,
      ...comment.data(),
      content: newContent,
      user,
    };
  } catch (error) {
    console.error("Error actualizando el comentario:", error);
    throw error;
  }
};



// Este es el editor para los comentarios






const getComments = async (reviewId) => {
  try {
    const collectionRef = collection(db, "comments");
    const q = query(collectionRef, where("reviewId", "==", reviewId));

    const querySnapshot = await getDocs(q);

    const comments = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Obtener información de los usuarios que comentaron
    return await Promise.all(
      comments.map(async (comment) => {
        const user = await getUser(comment.uid);
        return {
          id: comment.id,
          ...comment,
          user,
        };
      })
    );
  } catch (e) {
    console.error("Error getting comments:", e);
    return [];
  }
};


const deleteComment = async (commentId) => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);
    return true;
  } catch (e) {
    console.error("Error deleting comment:", e);
    return false;
  }
};

export { createReview, updateReview, getReviews, deleteReview , createComment, getComments, deleteComment,updateComment };
