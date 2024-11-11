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

const createReview = async (bookId, uid, rating, content) => {
  try {
    const reviewRef = await addDoc(collection(db, "reviews"), {
      bookId,
      uid,
      rating,
      content,
    });
    const reviewId = reviewRef.id;

    const user = await getUser(uid);

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

export { createReview, updateReview, getReviews, deleteReview };
