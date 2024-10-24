// user profile page on react, cackra ui, nextjs and firebase
"use client";

import React from "react";
import { Box, Flex, Heading, Text } from "@chakra-ui/react";
// import { useAuth } from "@/lib/auth";
import { getAuth } from "firebase/auth";
import { app } from "@/components/register_and_log/firebase";

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
      <Heading>Perfil de Usuario</Heading>
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
      </Box>
    </Flex>
  );
};

export default UserProfile;
