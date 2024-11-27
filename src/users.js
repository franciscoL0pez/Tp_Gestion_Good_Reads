import { db, storage } from "@/services/firebase";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";

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

    const users = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
      followers: doc.data().followers || [],
      following: doc.data().following || [],
    }));
    return users[0];
  } catch (e) {
    console.error("Error getting document:", e);
    return null;
  }
};

const getUsers = async () => {
  try {
    const collectionRef = collection(db, "users");
    const querySnapshot = await getDocs(collectionRef);

    const promises = querySnapshot.docs.map(async (doc) => {
      const storageRef = ref(storage, `users/${doc.data().uid}/profile`);

      let imageUrl;

      try {
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        imageUrl =
          "https://firebasestorage.googleapis.com/v0/b/login-29a91.appspot.com/o/users%2Fdefault_profile_pic.jpg?alt=media&token=eec674ba-42a5-43ba-98dc-8198183a3530";
      }

      return {
        ...doc.data(),
        id: doc.id,
        followers: doc.data().followers || [],
        following: doc.data().following || [],
        photoURL: imageUrl,
      };
    });
    return await Promise.all(promises);
  } catch (e) {
    console.error("Error getting document:", e);
    return null;
  }
};

const updateUser = async (uid, data) => {
  try {
    const dbUser = await getUser(uid);

    const userRef = doc(db, "users", dbUser.id);

    await updateDoc(userRef, data);
    console.log("data:", data);
    return true;
  } catch (error) {
    console.error("Error updating document: ", error);
    return null;
  }
};

export { createUser, getUser, updateUser, getUsers };
