"use client";
import React, { useState } from "react";
import { auth } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (password !== repeatPassword) {
        toast({
          title: "Error",
          description: "Las contraseñas no coinciden",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }
      setLoading(true);

      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/home");
    } catch (err) {
      toast({
        title: "Error",
        description: "Hubo un error al crear la cuenta, intente nuevamente",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      p={"10px"}
      style={{
        background: "gray.100",
      }}
      bg={"gray.100"}
    >
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
            <Heading fontWeight={400}>¡Bienvenido!</Heading>
            <Input
              bg={"white"}
              w={"80%"}
              placeholder={"Email"}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
            <Input
              bg={"white"}
              w={"80%"}
              placeholder={"Contraseña"}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type={"password"}
            />
            <Input
              bg={"white"}
              w={"80%"}
              placeholder={"Repetir contraseña"}
              onChange={(e) => {
                setRepeatPassword(e.target.value);
              }}
              type={"password"}
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
              Registrarse
            </Button>
            <Text>
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" color={"green.500"}>
                Inicia sesión
              </Link>
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
export default SignUp;
