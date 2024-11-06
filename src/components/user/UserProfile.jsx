"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Flex, Heading, Text, Image } from "@chakra-ui/react";
import { getAuth } from "firebase/auth";
import { app } from "@/services/firebase";
import { getUser } from "@/services/users";

const UserProfile = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getUser(user.uid);
      console.log("data:", data);
      setUserData(data);
    };
    fetchUserData();
  }, [user.uid]);

  if (!userData) {
    return <Text>Loading...</Text>;
  }

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
        <Text mt={"10px"}>
          <strong>Edad:</strong> 24
        </Text>
        <Text mt={"10px"}>
          <strong>Género:</strong> Hombre
        </Text>
        <Text mt={"10px"}>
          <strong>Géneros Favoritos:</strong>{" "}
          {userData.genres
            ? userData.genres.map((genre) => genre.label).join(", ")
            : "No genres available"}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserProfile;
