"use client";

import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
// import { useAuth } from "@/lib/auth";
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
      <Flex 
        w={"100%"}
        maxW={"500px"}
        // margin={"20px"}
        gap={"20px"}
        align={"center"}
      >
        <Button>
          <a href="/home">Volver</a>
        </Button>
        <Heading>Perfil de Usuario</Heading>

      </Flex>
      <Box
        w={"100%"}
        maxW={"500px"}
        p={"20px"}
        my={"20px"}
        bg={"white"}
        boxShadow={"md"}
        borderRadius={"md"}
      >
        <Text>
          <strong>Nombre:</strong> {user.displayName}
        </Text>
        <Text>
          <strong>Email:</strong> {user.email}
        </Text>
        <Button marginTop={"20px"} ml={"auto"}>
          <a href="/home/profile/edit">Editar Perfil</a>
        </Button>
      </Box>
    </Flex>
  );
};

export default UserProfile;
