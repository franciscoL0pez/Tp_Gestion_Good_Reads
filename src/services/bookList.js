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

// Crear o actualizar la lista de libros de un usuario
const createOrUpdateBooklist = async (uid, inProgress = [], completed = []) => {
  try {
    const booklistRef = doc(db, "booklists", uid); // Asegúrate de usar "booklists" como colección

    // Verificar si ya existe la lista de libros del usuario
    const booklistSnap = await getDoc(booklistRef);

    if (booklistSnap.exists()) {
      // Si ya existe, actualizamos las listas con los nuevos datos
      await updateDoc(booklistRef, {
        inProgress: arrayUnion(...inProgress),  // Añadir libros a la lista en progreso
        completed: arrayUnion(...completed),    
      
      });
    } else {
      // Si no existe, creamos una nueva lista de libros
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

// Obtener la lista de libros de un usuario
const getBooklist = async (uid) => {
  try {
    const booklistRef = doc(db, "booklists", uid);
    const booklistSnap = await getDoc(booklistRef);

    if (booklistSnap.exists()) {
      return booklistSnap.data(); 
    } else {
      return { inProgress: [], completed: []}; 
    }
  } catch (e) {
    console.error("Error getting booklist:", e);
    return { inProgress: [], completed: []}; 
  }
};

// Añadir un libro a la lista de "readingList"
const addToReadingList = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, "booklists", uid); // Asegúrate de que el nombre del documento sea correcto
    await updateDoc(booklistRef, {
      readingList: arrayUnion(bookId), 
    });
    return true;
  } catch (e) {
    console.error("Error adding book to reading list:", e);
    return false;
  }
};


const removeFromReadingList = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, "booklists", uid); 
    await updateDoc(booklistRef, {
      readingList: arrayRemove(bookId), 
    });
    return true;
  } catch (e) {
    console.error("Error removing book from reading list:", e);
    return false;
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
    console.error("Error adding book to inProgress list:", e);
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

// Eliminar un libro de la lista de "inProgress"
const removeFromInProgress = async (uid, bookId) => {
  try {
    const booklistRef = doc(db, "booklists", uid);
    await updateDoc(booklistRef, {
      inProgress: arrayRemove(bookId), 
    });
    return true;
  } catch (e) {
    console.error("Error removing book from inProgress list:", e);
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

export {
  createOrUpdateBooklist,
  getBooklist,
  addToReadingList,
  removeFromReadingList,
  addToInProgress,
  markAsCompleted,
  removeFromInProgress,
  deleteBooklist,
};

