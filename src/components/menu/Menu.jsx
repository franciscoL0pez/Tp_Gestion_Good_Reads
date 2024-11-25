"use client";

import { useState } from "react";
import {
  Button,
  Flex,
  Image,
  Box,
  Collapse,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Book,
  Logout,
  Home2,
  Profile2User,
  User,
  Menu as MenuIcon,
  Notification,
} from "iconsax-react";
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
        transition="background 0.3s ease, transform 0.3s ease"
        _hover={{
          bg: "gray.100",
          transform: "scale(1.05)",
        }}
        _active={{
          transform: "scale(0.98)",
        }}
      >
        {icon}
        {title}
      </Flex>
    </Link>
  );
};

const Menu = () => {
  const { isOpen, onToggle } = useDisclosure(); // Usando useDisclosure para manejar el menú móvil
  const [isHovered, setIsHovered] = useState(false); // Para manejar el hover del icono de menú

  return (
    <Flex
      w={"220px"}
      minW={"220px"}
      direction={"column"}
      bg={"white"}
      justify={"space-between"}
      pb={"50px"}
      boxShadow="md"
      borderRadius="lg"
      transition="all 0.3s ease"
      position="relative"
    >
      {/* Botón de menú (hamburguesa) para dispositivos móviles */}
      <IconButton
        icon={<MenuIcon size="32" />}
        aria-label="Abrir menú"
        onClick={onToggle}
        position="absolute"
        top="20px"
        left="20px"
        variant="ghost"
        _hover={{
          bg: "gray.100",
        }}
        display={{ base: "block", md: "none" }}
      />

      {/* Logo */}
      <Image src="/images/logo.jpg" width={180} height={180} mb="20px" />

      {/* Menú desplegable para dispositivos móviles */}
      <Collapse in={isOpen} animateOpacity>
        <Box>
          <Flex direction={"column"} gap={"15px"}>
            <MenuLink href="/home/home2" title="Home">
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
        </Box>
      </Collapse>

      {/* Menú visible para pantallas grandes */}
      <Flex
        direction={"column"}
        gap={"15px"}
        display={{ base: "none", md: "flex" }}
        alignItems={"center"}
      >
        <MenuLink href="/home/home2" title="Home">
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
        <MenuLink href="/home/notifications" title="Notificaciones">
          <Notification size="28" color="black" />
        </MenuLink>
      </Flex>

      {/* Botón de cerrar sesión */}
      <Button
        fontSize={"sm"}
        gap={"10px"}
        variant={"ghost"}
        onClick={async () => {
          await signOut(auth);
        }}
        mt="auto"
        _hover={{
          bg: "gray.100",
          transform: "scale(1.05)",
        }}
        transition="transform 0.3s ease"
      >
        <Logout size="28" color="black" />
        Cerrar sesión
      </Button>
    </Flex>
  );
};

export default Menu;
