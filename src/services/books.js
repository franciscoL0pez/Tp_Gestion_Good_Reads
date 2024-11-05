import { db, storage } from "@/services/firebase";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getUser } from "@/services/users";
import { getReviews } from "@/services/reviews";

const createBook = async (bookData, pdf, cover) => {
  try {
    const bookRef = await addDoc(collection(db, "books"), bookData);
    const bookId = bookRef.id;

    const pdfRef = ref(storage, `${bookData.uid}/books/${bookId}/pdf`);
    const coverRef = ref(storage, `${bookData.uid}/books/${bookId}/cover`);

    await uploadBytes(pdfRef, pdf);
    await uploadBytes(coverRef, cover);

    const pdfUrl = await getDownloadURL(pdfRef);
    const coverUrl = await getDownloadURL(coverRef);

    const author = await getUser(bookData.uid);

    return {
      id: bookId,
      ...bookData,
      pdf: pdfUrl,
      cover: coverUrl,
      author,
      reviews: [],
    };
  } catch (e) {
    console.error("Error adding document:", e);
    return null;
  }
};

const updateBook = async (bookId, bookData, cover, pdf) => {
  try {
    const bookRef = doc(db, "books", bookId);
    await updateDoc(bookRef, bookData);
    const coverRef = ref(storage, `${bookData.uid}/books/${bookId}/cover`);
    const pdfRef = ref(storage, `${bookData.uid}/books/${bookId}/pdf`);

    if (cover) {
      await uploadBytes(coverRef, cover);
    }

    if (pdf) {
      await uploadBytes(pdfRef, pdf);
    }

    const author = await getUser(bookData.uid);

    const pdfUrl = await getDownloadURL(pdfRef);
    const coverUrl = await getDownloadURL(coverRef);

    const reviews = await getReviews(bookId);

    return {
      id: bookId,
      ...bookData,
      pdf: pdfUrl,
      cover: coverUrl,
      author,
      reviews,
    };
  } catch (e) {
    console.error("Error updating document:", e);
    return null;
  }
};

const getBooks = async () => {
  try {
    const collectionRef = collection(db, "books");
    const querySnapshot = await getDocs(collectionRef);

    const promises = querySnapshot.docs.map(async (doc) => {
      const pdfPath = `${doc.data().uid}/books/${doc.id}/pdf`;
      const coverPath = `${doc.data().uid}/books/${doc.id}/cover`;

      const pdfRef = ref(storage, pdfPath);
      const coverRef = ref(storage, coverPath);

      const pdfUrl = await getDownloadURL(pdfRef);
      const coverUrl = await getDownloadURL(coverRef);

      const author = await getUser(doc.data().uid);

      const reviews = await getReviews(doc.id);

      return {
        id: doc.id,
        ...doc.data(),
        pdf: pdfUrl,
        cover: coverUrl,
        author,
        reviews,
      };
    });

    return await Promise.all(promises);
  } catch (e) {
    console.error("Error getting documents:", e);
    return null;
  }
};

export { createBook, getBooks, updateBook };
