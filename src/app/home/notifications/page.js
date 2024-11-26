'use client';

import { useState, 
  useEffect } from "react";
import { Box, 
  Text, 
  VStack, 
  Badge, 
  useDisclosure, 
  Modal, 
  ModalOverlay, 
  ModalContent, 
  ModalHeader, 
  ModalCloseButton, 
  ModalBody } from "@chakra-ui/react";
import { fetchNotifications } from "@/services/notifications";
import { markNotificationAsRead } from "@/services/notifications";
import { auth } from "@/services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const Notificacions = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!userId) return;

      try {
        const firebaseNotifications = await fetchNotifications(userId);
        setNotifications(firebaseNotifications);
      } catch (error) {
        console.error("Error al cargar las notificaciones:", error);
      }
    };

    loadNotifications();
  }, [userId]);

  const handleNotificationClick = async (notification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );

    await markNotificationAsRead(notification.id);

    setSelectedNotification(notification);
    onOpen();
  };

  return (
    <Box p={5}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Tus Notificaciones
      </Text>
      <VStack spacing={3} align="stretch">
        {Array.isArray(notifications) && notifications.length === 0 ? (
          <Text>No hay notificaciones</Text>
        ) : (
          Array.isArray(notifications) && notifications.map((notification) => (
            <Box
              as="button"
              key={notification.id}
              p={4}
              bg={notification.read ? "gray.100" : "blue.50"}
              borderRadius="md"
              boxShadow="sm"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              onClick={() => handleNotificationClick(notification)}
            >
              <Text>{notification.message}</Text>
              {!notification.read && <Badge colorScheme="green">Nuevo</Badge>}
            </Box>
          ))
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles de la Notificación</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedNotification
              ? selectedNotification.message
              : "No hay información"}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Notificacions;
