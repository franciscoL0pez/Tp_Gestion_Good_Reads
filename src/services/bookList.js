import { db } from "@/services/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";


const createOrUpdateBooklist = async (uid, inProgress = [], completed = []) => {
  try {
    const booklistRef = doc(db, "booklists", uid);

    const booklistSnap = await getDoc(booklistRef);

    if (booklistSnap.exists()) {
      
      await updateDoc(booklistRef, {
        inProgress: arrayUnion(...inProgress),
        completed: arrayUnion(...completed),
      });
    } else {
      
      await setDoc(booklistRef, {
        inProgress,
        completed,
      });
    }

    return true; 
  } catch (e) {
    console.error("Error creating or updating booklist:", e);
    return false; 
  }
};


const getBooklist = async (uid) => {
  try {
    const booklistRef = doc(db, "booklists", uid);
    const booklistSnap = await getDoc(booklistRef);

    if (booklistSnap.exists()) {
      return booklistSnap.data(); 
    } else {
      return { inProgress: [], completed: [] }; 
    }
  } catch (e) {
    console.error("Error getting booklist:", e);
    return { inProgress: [], completed: [] }; 
  }
};


const addToInProgress = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, "booklists", uid);
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
    const booklistRef = doc(db, "booklists", uid);
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
    const booklistRef = doc(db, "booklists", uid);
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
    const booklistRef = doc(db, "booklists", uid);
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
    const booklistRef = doc(db, "booklists", uid);
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


const deleteBooklist = async (uid) => {
  try {
    const booklistRef = doc(db, "booklists", uid);
    await deleteDoc(booklistRef); 
    return true;
  } catch (e) {
    console.error("Error deleting booklist:", e);
    return false;
  }
};

const updateBooklist = async (uid, updatedData) => {
  try {
    const booklistRef = doc(db, "booklists", uid);
    await updateDoc(booklistRef, updatedData); 
    return true;
  } catch (e) {
    console.error("Error updating booklist:", e);
    return false;
  }
};

export {
  createOrUpdateBooklist,
  getBooklist,
  addToInProgress,
  removeFromInProgress,
  addToCompleted,
  removeFromCompleted,
  markAsCompleted,
  deleteBooklist,
  updateBooklist
};

