"use client";

import {
  Box,
  Text,
  VStack,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { M_PLUS_1 } from "next/font/google";
import { useState, useEffect } from "react";

const Notificacions = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {

    const fetchNotifications = async () => {
      const fakeData = [
        { id: 1, message: "La minita que te gusta comenzó a seguirte", read: false },
        { id: 2, message: "A Lionel Messi le gustó tu reseña", read: false },
        { id: 3, message: "Lionel Messi comenzó a seguirte", read: false },
      ];

      setNotifications(fakeData);
    };

    fetchNotifications();

  }, []);

  const handleNotificationClick = (notification) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((n) =>
        n.id === notification.id ? { ...n, read: true } : n
      )
    );
    setSelectedNotification(notification);
    onOpen();
  };

  return (
    <Box p={5}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Tus Notificaciones
      </Text>
      <VStack spacing={3} align="stretch">
        {notifications.length === 0 ? (
          <Text>No hay notificaciones</Text>
        ) : (
          notifications.map((notification) => (
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
              <Text>
                {notification.message}
              </Text>
              {!notification.read && <Badge colorScheme="green">Nuevo</Badge>}
            </Box>
          ))
        )}
      </VStack>

      
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalles de la Notificacion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedNotification
              ? selectedNotification.message
              : "No hay informacion"}
          </ModalBody>

        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Notificacions;
