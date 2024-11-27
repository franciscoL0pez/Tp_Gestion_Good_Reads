'use client';
import { db } from "@/services/firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    doc,
    updateDoc
    } from "firebase/firestore";


export async function addNotification(uid, message) {
    try {
        const notificationsRef = collection(db, `users/${uid}/notifications`);

        await addDoc(notificationsRef, {
            message: message,
            read: false,
            date: serverTimestamp(),
          });


    } catch (error){
        console.error(error)
    }
    
}


export async function fetchNotifications(uid){
    try {

        const notifications = [
            { id: 1, message: "La minita que te gusta comenzó a seguirte", read: false },
            { id: 2, message: "A Lionel Messi le gustó tu reseña", read: false },
            { id: 3, message: "Lionel Messi comenzó a seguirte", read: false },
        ];

        /*const notificationsRef = collection(db, `users/${uid}/notifications`);
        const query = query(notificationsRef, orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(query);

        const notifications = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));*/
        
        return notifications;

    } catch (error){
        console.error(error)
    }
}


export async function markNotificationAsRead(uid, notificationId){
    try {
        const notificationRef = doc(db, `users/${uid}/notifications/${notificationId}`);
        await updateDoc(notificationRef, {
        read: true,
        });
    } catch (error){
        console.error(error)
    }
}
