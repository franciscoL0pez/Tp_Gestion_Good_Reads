"use client";
import { db } from "@/services/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  orderBy,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export async function addNotification(uid, message) {
  try {
    const notificationsRef = collection(db, `users/${uid}/notifications`);

    await addDoc(notificationsRef, {
      message: message,
      read: false,
      date: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function fetchNotifications(uid) {
  try {
    // fetch the notifications from the database at the path `users/${uid}/notifications`
    const notificationsRef = collection(db, `users/${uid}/notifications`);

    const q = query(notificationsRef, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const notifications = [];
    querySnapshot.forEach((doc) => {
      const notification = doc.data();
      notification.id = doc.id;
      notifications.push(notification);
    });

    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

export async function markNotificationAsRead(uid, notificationId) {
  try {
    const notificationRef = doc(
      db,
      `users/${uid}/notifications/${notificationId}`,
    );
    await updateDoc(notificationRef, {
      read: true,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function sendFollowNotification(followedUid, followerName) {
  try {
    const notificationsRef = collection(
      db,
      `users/${followedUid}/notifications`,
    );

    await addDoc(notificationsRef, {
      message: `${followerName} comenzó a seguirte`,
      read: false,
      date: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function sendReviewNotification(followedUid, followerName) {
  try {
    const notificationsRef = collection(
      db,
      `users/${followedUid}/notifications`,
    );

    const response = await addDoc(notificationsRef, {
      message: `${followerName} te ha dejado una reseña`,
      read: false,
      date: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

export async function sendCommentNotification(followedUid, followerName) {
  try {
    const notificationsRef = collection(
      db,
      `users/${followedUid}/notifications`,
    );

    await addDoc(notificationsRef, {
      message: `${followerName} te ha dejado un comentario`,
      read: false,
      date: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

export function getUnreadNotificationsOnSnapshot(uid, callback) {
  const notificationsRef = collection(db, `users/${uid}/notifications`);
  const q = query(notificationsRef, orderBy("date", "desc"));

  return onSnapshot(q, (querySnapshot) => {
    const notifications = [];
    querySnapshot.forEach((doc) => {
      const notification = doc.data();
      notification.id = doc.id;
      notifications.push(notification);
    });

    const unreadNotifications = notifications.filter((n) => !n.read);
    callback(unreadNotifications);
  });
}
