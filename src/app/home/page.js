"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react";

export default function HomePage() {
  const [user] = useAuthState(auth);

  return (
    <Flex w={"100%"} h={"100%"} p={"5%"}>
      <Heading fontWeight={400} fontSize={"40px"}>
        Bienvenido {user.displayName}
        
      </Heading>
    </Flex>
  );
}
