"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { auth, db } from "@/services/firebase";
import { Button, FormControl, FormLabel, Input, Box, Heading, useToast, Flex } from "@chakra-ui/react";

const EditProfile = () => {
  const user = auth.currentUser;
  const router = useRouter();
  const toast = useToast();

  // State for form fields
  const [name, setName] = useState(user?.displayName || "");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.displayName) {
      const splitName = user.displayName.split(" ");
      setName(splitName[0]);
      setLastName(splitName[1] || "");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Update profile (name and last name)
        if (name || lastName) {
          await updateProfile(user, {
            displayName: `${name} ${lastName}`,
          });
        }

        // Update email
        // if (email !== user.email) {
        //   await updateEmail(user, email);

        // Update password (optional)
        // if (password) {
        //   await updatePassword(user, password);
        // }

        toast({
          title: "Perfil actualizado",
          description: "Tu perfil ha sido actualizado exitosamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        router.push("/home"); // Redirect after successful update
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="xl" mx="auto" mt={10} p={5} shadow="md" borderWidth="1px"
      background={"white"} borderRadius={"md"} 
    >
      <Heading as="h2" size="lg" mb={6}>
        Editar Perfil
      </Heading>

      <form onSubmit={handleSubmit}>
        <FormControl id="name" mb={4}>
          <FormLabel>Nombre</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
          />
        </FormControl>

        <FormControl id="lastName" mb={4}>
          <FormLabel>Apellido</FormLabel>
          <Input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Tu apellido"
          />
        </FormControl>

        <FormControl id="email" mb={4}>
          <FormLabel>Correo electrónico</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
          />
        </FormControl>

        <FormControl id="password" mb={4}>
          <FormLabel>Contraseña (opcional)</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Nueva contraseña (dejar en blanco para no cambiar)"
          />
        </FormControl>
        <Flex
          direction={["column", "row"]}
          align={["start", "center"]}
          justify="space-between"
        >
          <Button
            colorScheme="gray"
            onClick={() => router.push("/home/profile")} 
          >
            <a href="/home/profile">Cancelar</a>
          </Button>
          <Button
            colorScheme="teal"
            type="submit"
            isLoading={loading}
            loadingText="Actualizando..."
          >
            Guardar Cambios
          </Button>

        </Flex>
      </form>
    </Box>
  );
};

export default EditProfile;
