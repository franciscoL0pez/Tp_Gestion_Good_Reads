import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";

const createUser = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "users"), data);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document: ", error);
    return null;
  }
};

const getUser = async (uid) => {
  try {
    const collectionRef = collection(db, "users");
    const q = query(collectionRef, where("uid", "==", uid));

    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => doc.data());
    return users[0];
  } catch (e) {
    console.error("Error getting document:", e);
    return null;
  }
};

const updateUser = async (uid, data) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, data);
    console.log("data:", data);
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return null;
  }
};

export { createUser, getUser, updateUser };
