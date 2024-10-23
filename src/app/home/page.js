"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { auth } from "@/components/register_and_log/firebase";
import { Button, Flex, Spinner, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [user, loading] = useAuthState(auth);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      p={"10px"}
      direction={"column"}
      bg={"gray.100"}
      align={"center"}
      justify={"center"}
    >
      <Text fontSize={"5xl"}>
        {loading ? (
          <Spinner />
        ) : user ? (
          `Bienvenido ${user.email}`
        ) : (
          "Inicia sesión"
        )}
      </Text>
      {user && (
        <>
          <Button
            mb={4}
            onClick={() => {
              router.push("/profile");
            }}
          >
            Perfil
          </Button>
          <Button
            onClick={async () => {
              await signOut(auth);
              router.push("/login");
            }}
          >
            Cerrar sesión
          </Button>
        </>
      )}
    </Flex>
  );
}
