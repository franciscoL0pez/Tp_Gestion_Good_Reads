"use client";
import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Button,
  Flex,
  Heading,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err) {
      console.log(err);
      toast({
        title: "Error",
        description: "Credenciales incorrectas",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <Flex w={"100vw"} h={"100vh"} p={"10px"} bg={"gray.100"}>
      <Flex
        w={"100%"}
        h={"100%"}
        borderRadius={"20px"}
        align={"center"}
        justify={"center"}
      >
        <Flex
          w={"50%"}
          h={"100%"}
          borderRadius={"20px"}
          backgroundImage={"/images/bookshelf.webp"}
          backgroundSize={"cover"}
          maxW={"800px"}
          boxShadow={"lg"}
        />
        <Flex
          w={"50%"}
          h={"100%"}
          borderRadius={"0 20px 20px 0"}
          maxW={"800px"}
          justify={"center"}
          align={"center"}
          direction={"column"}
        >
          <Flex
            direction={"column"}
            justify={"center"}
            align={"center"}
            w={"50%"}
            minW={"500px"}
            bg={"white"}
            py={"100px"}
            px={"20px"}
            borderRadius={"10px"}
            boxShadow={"md"}
            gap={"20px"}
          >
            <Heading fontWeight={400}>¡Hola de nuevo!</Heading>
            <Input
              bg={"white"}
              w={"80%"}
              placeholder={"Email"}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              bg={"white"}
              w={"80%"}
              placeholder={"Contraseña"}
              type={"password"}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              w={"80%"}
              bg={"green.700"}
              color={"white"}
              _hover={{
                opacity: 0.8,
              }}
              _active={{}}
              onClick={handleSubmit}
              isLoading={loading}
            >
              Iniciar Sesión
            </Button>
            <Text>
              ¿No tienes cuenta?{" "}
              <Link href={"/register"} color={"green.400"}>
                Regístrate
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default Login;
