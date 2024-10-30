"use client";

import React from "react";
import { Box, Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { app } from "@/services/firebase";

const UserProfile = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  return (
    <Flex
      w={"100%"}
      h={"100%"}
      p={"10px"}
      style={{
        background: "gray.100",
      }}
      direction={"column"}
      align={"center"}
    >
      <Flex w={"80%"} maxW={"800px"} gap={"20px"} align={"center"}>
        <Heading>Perfil de Usuario</Heading>
        <Button ml="auto">
          <a href="/home">Volver</a>
        </Button>
      </Flex>
      <Box
        w={"80%"}
        maxW={"800px"}
        p={"20px"}
        my={"20px"}
        bg={"white"}
        boxShadow={"md"}
        borderRadius={"md"}
      >
        <Flex justifyContent={"flex-end"} mb={"10px"}>
          <Button>
            <a href="/home/profile/edit">Editar</a>
          </Button>
        </Flex>
        <Flex
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          mb={"20px"}
          marginBottom={"20px"}
        >
          <Image
            src={user.photoURL}
            alt={user.displayName}
            w={"200px"}
            h={"200px"}
            borderRadius={"full"}
          />
          <Text mt={"10px"} fontSize={"50px"}>
            {user.displayName}
          </Text>
        </Flex>

        <Text>
          <strong>Email:</strong> {user.email}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserProfile;
