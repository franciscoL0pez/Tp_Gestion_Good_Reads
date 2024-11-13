"use client";

import React from "react";
import { Box, Button, Flex, Heading, Text, Image, Icon } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { app } from "@/services/firebase";
import { useUserData } from "@/hooks/useUserData";
import { FaRegSmileBeam } from "react-icons/fa"; // Sticker de sonrisa

const UserProfile = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const { userData } = useUserData();

  if (!userData) {
    return <Text>Cargando...</Text>;
  }

  return (
    <Flex
      w={"100%"}
      h={"100%"}
      p={"5%"}
      bg={"white"} // Fondo blanco
      direction={"column"}
      align={"center"}
      justify={"center"}
      overflow={"hidden"}
    >
      {/* Título de la página */}
      <Flex
        w={"100%"}
        maxW={"800px"}
        gap={"20px"}
        align={"center"}
        justify={"space-between"}
        mb={"20px"}
        borderBottom={"3px solid #48BB78"} // Línea verde debajo del título
      >
        <Heading fontSize={"xl"} color={"#2f855a"} fontWeight={"bold"}>
          Perfil de Usuario
        </Heading>
        <Button
          colorScheme="green"
          variant="solid"
          size="md"
          _hover={{
            transform: "scale(1.05)", // Animación suave al pasar el ratón
            boxShadow: "xl",
            backgroundColor: "#38a169", // Cambio de color en hover
          }}
        >
          <a href="/home">Volver</a>
        </Button>
      </Flex>

      {/* Caja del perfil */}
      <Box
        w={"100%"}
        maxW={"800px"}
        p={"25px"}
        my={"30px"}
        bg={"white"}
        boxShadow={"lg"}
        borderRadius={"lg"}
        transition="all 0.3s ease"
        _hover={{
          boxShadow: "2xl",
          transform: "scale(1.02)",
        }}
      >
        {/* Botón de edición */}
        <Flex justifyContent={"flex-end"} mb={"20px"}>
          <Button
            colorScheme="teal"
            variant="outline"
            size="md"
            _hover={{
              transform: "scale(1.05)",
              boxShadow: "lg",
            }}
          >
            <a href="/home/profile/edit">Editar</a>
          </Button>
        </Flex>

        {/* Foto y nombre del usuario */}
        <Flex
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mb={"30px"}
          position="relative"
        >
          <Image
            src={user.photoURL}
            alt={user.displayName}
            w={"200px"} // Tamaño base
            h={"200px"}
            maxW={"300px"} // Máximo tamaño en HD
            maxH={"300px"}
            borderRadius={"full"}
            boxShadow="0px 6px 20px rgba(0,0,0,0.2)"
            transition="all 0.3s ease"
            _hover={{
              transform: "scale(1.1)",
              boxShadow: "0px 8px 30px rgba(0,0,0,0.3)",
            }}
            srcSet={`
              ${user.photoURL} 1x,
              ${user.photoURL} 2x,
              ${user.photoURL} 3x
            `} // Añadido para mejorar resolución
          />
          <Text
            mt={"15px"}
            fontSize={"2xl"}
            fontWeight="bold"
            color={"#2f855a"}
            textAlign="center"
            letterSpacing={"1px"}
          >
            {user.displayName}
          </Text>

          {/* Sticker divertido */}
          <Icon
            as={FaRegSmileBeam}
            w={8}
            h={8}
            color={"#48BB78"}
            position="absolute"
            top={5}
            right={5}
            animation="bounce 2s infinite" // Animación de rebote
            transform="scale(1.5)"
          />
        </Flex>

        {/* Información adicional */}
        <Text fontSize={"lg"} color="#4a5568" mb={"15px"}>
          <strong>Email:</strong> {user.email}
        </Text>
        <Text fontSize={"lg"} color="#4a5568" mb={"15px"}>
          <strong>Edad:</strong> {userData.age || "No disponible"}
        </Text>
        <Text fontSize={"lg"} color="#4a5568" mb={"15px"}>
          <strong>Género:</strong> Hombre
        </Text>
        <Text fontSize={"lg"} color="#4a5568" mb={"20px"}>
          <strong>Géneros Favoritos:</strong>{" "}
          {userData.genres
            ? userData.genres.map((genre) => genre.label).join(", ")
            : "No disponible"}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserProfile;



