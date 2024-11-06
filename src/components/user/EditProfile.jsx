"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile, updateEmail, updatePassword } from "firebase/auth";
import { auth, db, storage } from "@/services/firebase";
import { updateUser } from "@/services/users";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  Heading,
  useToast,
  Flex,
  Image,
} from "@chakra-ui/react";
import MultiSelect from "../ui/MultiSelect";
import ImageUpload from "../ui/ImageInput";
import genres from "../../../data/generos.json";

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
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(user.photoURL || "");
  const [selectedGenres, setSelectedGenres] = useState([]);

  const handleImageChange = (file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create a preview URL
      setImagePreview(imageUrl); // Update the preview
      setImage(file);
    }
  };

  useEffect(() => {
    if (user?.displayName) {
      const splitName = user.displayName.split(" ");
      setName(splitName[0]);
      setLastName(splitName[1] || "");
    }

    const fetchUserGenres = async () => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("userData:", userData);
          setSelectedGenres(userData.genres || []);
        }
      }
    };

    fetchUserGenres();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // save image in storage
        if (image) {
          const storageRef = ref(storage, `users/${user.uid}/profile`);
          await uploadBytes(storageRef, image);
          const imageUrl = await getDownloadURL(storageRef);
          await updateProfile(user, {
            photoURL: imageUrl,
          });
        }

        if (name || lastName) {
          await updateProfile(user, {
            displayName: `${name} ${lastName}`,
          });
        }

        // update user in db
        await updateUser(user.uid, {
          name,
          lastName,
          email,
          genres: selectedGenres,
        });

        toast({
          title: "Perfil actualizado",
          description: "Tu perfil ha sido actualizado exitosamente.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        router.push("/home/profile"); // Redirect after successful update
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
    <Box
      // maxW="xl"
      maxWidth={"600px"}
      width={"60%"}
      mx="auto"
      mt={10}
      p={5}
      shadow="md"
      borderWidth="1px"
      background={"white"}
      borderRadius={"md"}
    >
      <Heading as="h2" size="lg" mb={6}>
        Editar Perfil
      </Heading>

      <Flex justifyContent="center" mb={6}>
        <Image
          src={imagePreview || user.photoURL}
          alt={user.displayName}
          w={"200px"}
          h={"200px"}
          borderRadius={"full"}
        />
      </Flex>
      <form onSubmit={handleSubmit}>
        <FormControl id="image" mb={4}>
          <ImageUpload onImageChange={handleImageChange} />
        </FormControl>

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

        <MultiSelect
          label="Géneros favoritos"
          options={genres}
          placeholder="Selecciona tus géneros favoritos"
          value={selectedGenres} // Set the value to selectedGenres
          onChange={(selected) => setSelectedGenres(selected)} // Ensure selected values are mapped correctly
        />

        <Flex
          mt={6}
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
