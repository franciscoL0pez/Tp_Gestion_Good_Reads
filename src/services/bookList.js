import { db } from "@/services/firebase";
import {
  doc,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  addDoc,
  collection,
  query,
  where
} from "firebase/firestore";

import { getBook } from "@/services/books";

const IN_PROGRESS = "in_progress"
const COMPLETED = "completed"

const collectionName = "lectures"


const createBooklist = async (uid, bookId) => {
  try {
    const booklistRef = await addDoc(collection(db, collectionName), {
      uid,
      bookId,
      status: IN_PROGRESS
    });

    const bookListId = booklistRef.id;
   
    const book = await getBook(bookId)

    return {
      id: bookListId,
      uid,
      book,
    };
  } catch (e) {
    console.log("ERROR", e)
   
    return null;
  }
};



const getBooklist = async (uid) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    const lectures = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const data = doc.data();

      const book = await getBook(data.bookId);

      return {
        id: doc.id,
        uid: data.uid,
        book,
        status: data.status
      };
    }));


    const booksInProgress = lectures.filter(lecture => lecture.status === IN_PROGRESS );
    const completedBooks = lectures.filter(lecture => lecture.status === COMPLETED );

    return { booksInProgress, completedBooks };
  } catch (e) {
    console.error("Error getting booklist:", e);
    return { booksInProgress: [], completedBooks: [] }; 
  }
};

const getLectureByBookId = async (uid, bookId) => {
  try {
    
   
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("uid", "==", uid), where("bookId", "==", bookId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const doc = querySnapshot.docs[0];
    const data = doc.data();
    const book = await getBook(data.bookId);

    return {
      id: doc.id,
      uid: data.uid,
      book,
      status: data.status
    };
  } catch (e) {
    console.error("Error getting lecture by bookId:", e);
    return null;
  }
};



const addToInProgress = async (uid, bookId) => {
  try {
    
    const booklistRef = doc(db, collectionName, uid);
    await updateDoc(booklistRef, {
      inProgress: arrayUnion(bookId), 
    });
    return true;
  } catch (e) {
    console.error("Error adding book to inProgress:", e);
    return false;
  }
};


const removeFromInProgress = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, collectionName, uid);
    await updateDoc(booklistRef, {
      inProgress: arrayRemove(bookId), 
    });
    return true;
  } catch (e) {
    console.error("Error removing book from inProgress:", e);
    return false;
  }
};


const addToCompleted = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, collectionName, uid);
    await updateDoc(booklistRef, {
      completed: arrayUnion(bookId), 
    });
    return true;
  } catch (e) {
    console.error("Error adding book to completed:", e);
    return false;
  }
};


const removeFromCompleted = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, collectionName, uid);
    await updateDoc(booklistRef, {
      completed: arrayRemove(bookId), 
    });
    return true;
  } catch (e) {
    console.error("Error removing book from completed:", e);
    return false;
  }
};


const markAsCompleted = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, collectionName, uid);
    await updateDoc(booklistRef, {
      inProgress: arrayRemove(bookId), 
      completed: arrayUnion(bookId),  
    });
    return true;
  } catch (e) {
    console.error("Error marking book as completed:", e);
    return false;
  }
};


const deleteLecture = async (uid, bookId) => {
  try {
  
    const lecture = await getLectureByBookId(uid, bookId);
   
    if (lecture) {
    
      const booklistRef = doc(db, collectionName, lecture.id);
      await deleteDoc(booklistRef);
      return true;
    }

    return false;
  } catch (e) {
    console.error("Error deleting booklist:", e);
    return false;
  }
};

// UPDATE status in database with bookId and uide

const updateBooklist = async (uid, bookId, newStatus) => {
  try {
  
    const lecture = await getLectureByBookId(uid, bookId);

    if (lecture) {
      const booklistRef = doc(db, collectionName, lecture.id);
      const updatedData = {
        status: newStatus
      };

      await updateDoc(booklistRef, updatedData); 
      return true

    }
    
    return false;
  } catch (e) {
    console.error("Error updating booklist:", e);
    return false;
  }
};

export {
  getBooklist,
  addToInProgress,
  removeFromInProgress,
  addToCompleted,
  removeFromCompleted,
  markAsCompleted,
  deleteLecture,
  updateBooklist,
  createBooklist,
  getLectureByBookId,
};

