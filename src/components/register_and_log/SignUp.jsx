"use client";
import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  Button,
  Checkbox,
  Flex,
  Heading,
  Input,
  Link,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { createUser } from "@/services/users";
import { auth, db, storage } from "@/services/firebase";

const SignUp = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const toast = useToast();

  const followers = [];
  const following = [];

  const releases = 0;

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

      if (!email || !password || !name || !lastName) {
        toast({
          title: "Error",
          description: "Todos los campos son obligatorios",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        return;
      }

      setLoading(true);

      const auth = getAuth();

      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(user, {
        displayName: `${name} ${lastName}`,
        photoURL:
          "https://firebasestorage.googleapis.com/v0/b/login-29a91.appspot.com/o/users%2Fdefault_profile_pic.jpg?alt=media&token=eec674ba-42a5-43ba-98dc-8198183a3530",
      });

      await createUser({
        uid: user.uid,
        isAuthor,
        name,
        lastName,
        followers,
        following,
        releases,
      });

      // save user data in db
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name,
        lastName,
        // age,
        // gender,
        email,
        isAuthor,
        followers,
        following,
        releases,
      });

      console.log("User created:", user);

      router.push("/home");
    } catch (error) {
      // Handle Firebase-specific errors
      let errorMessage = "Hubo un error al crear la cuenta, intente nuevamente";

      if (error.code === "auth/email-already-in-use") {
        errorMessage = "El correo ya está en uso. Intente con otro.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "La contraseña es muy débil. Use al menos 6 caracteres.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "El formato del correo no es válido.";
      }

      console.log("Error creating new user:", error);

      toast({
        title: "Error",
        description: errorMessage,
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
              placeholder={"Nombre"}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <Input
              bg={"white"}
              w={"80%"}
              placeholder={"Apellido"}
              onChange={(e) => {
                setLastName(e.target.value);
              }}
            />
            {/* <NumberInput
              bg={"white"}
              w={"80%"}
              placeholder={"Edad"}
              onChange={(e) => {
                setAge(e.target.value);
              }}
            />
            <Select
              bg={"white"}
              w={"80%"}
              placeholder={"Género"}
              onChange={(e) => {
                setGender(e.target.value);
              }}
            /> */}
            {/* <Select
              bg={"white"}
              w={"80%"}
              placeholder={"País"}
              onChange={(e) => {
                setCountry(e.target.value);
              }}
            > */}
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
            <Checkbox
              isChecked={isAuthor}
              onChange={(e) => {
                setIsAuthor(e.target.checked);
              }}
            >
              Soy autor
            </Checkbox>
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
