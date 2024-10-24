"use client";
import { Flex, Spinner } from "@chakra-ui/react";
import Menu from "@/components/menu/Menu";
import SessionVerifier from "@/components/session/SessionVerifier";

export default function HomeLayout({ children }) {
  return (
    <SessionVerifier>
      <Flex w={"100vw"} h={"100vh"}>
        <Menu />
        <Flex
          direction={"column"}
          w={"calc(100% - 220px)"}
          p={"20px"}
          bg={"gray.100"}
        >
          {children}
        </Flex>
      </Flex>
    </SessionVerifier>
  );
}
