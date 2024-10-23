// user profile page on react, cackra ui, nextjs and firebase
"use client";

import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
// import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/components/register_and_log/firebase";

const UserProfile = () => {
  const auth = getAuth(app);
  const user = auth.currentUser;
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    });
  }, []);

  if (loading) {
    return <Heading>Loading...</Heading>;
  }

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
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
      </Box>
    </Flex>
  );
};

export default UserProfile;
