"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/components/register_and_log/firebase";
import { Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Flex } from "@chakra-ui/react";

const SessionVerifier = ({ children }) => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      return setMounted(true);
    }

    if (!user && !loading) {
      router.push("/login");
    }
  }, [user, loading, mounted]);

  if (!user || !mounted) {
    return (
      <Flex
        w={"100vw"}
        h={"100vh"}
        align={"center"}
        justify={"center"}
        bg={"gray.200"}
      >
        <Spinner color={"green.700"} />
      </Flex>
    );
  }

  return children;
};

export default SessionVerifier;
