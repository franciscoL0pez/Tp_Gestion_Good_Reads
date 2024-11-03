"use client";

import { Button, Flex, Image } from "@chakra-ui/react";
import { Book, Home2, Logout, Profile2User, User } from "iconsax-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/services/firebase";

const MenuLink = ({ href, children: icon, title }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href}>
      <Flex
        align={"center"}
        gap={"10px"}
        w={"170px"}
        bg={isActive ? "gray.200" : "transparent"}
        padding={"10px"}
        borderRadius={"10px"}
        textDecoration={"none"}
        _hover={{
          bg: "gray.100",
        }}
      >
        {icon}
        {title}
      </Flex>
    </Link>
  );
};

const Menu = () => {
  return (
    <Flex
      w={"220px"}
      minW={"220px"}
      align={"center"}
      direction={"column"}
      bg={"white"}
      justify={"space-between"}
      pb={"50px"}
    >
      <Image src="/images/logo.jpg" width={180} height={180} />
      <Flex direction={"column"} gap={"15px"} h={"50%"}>
        <MenuLink href="/home" title="Home">
          <Home2 size="28" color="black" />
        </MenuLink>
        <MenuLink href="/home/books" title="Libros">
          <Book size="28" color="black" />
        </MenuLink>
        <MenuLink href="/home/community" title="Comunidad">
          <Profile2User size="28" color="black" />
        </MenuLink>
        <MenuLink href="/home/profile" title="Perfil">
          <User size="28" color="black" />
        </MenuLink>
      </Flex>
      <Button
        fontSize={"sm"}
        gap={"10px"}
        variant={"ghost"}
        onClick={async () => {
          await signOut(auth);
        }}
      >
        <Logout size="28" color="black" />
        Cerrar sesión
      </Button>
    </Flex>
  );
};

export default Menu;
