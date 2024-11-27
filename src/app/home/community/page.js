"use client";

import {
  Button,
  Flex,
  Heading,
  Skeleton,
  Text,
  Box,
  Avatar,
} from "@chakra-ui/react";
import { useUsers } from "@/hooks/useUsers";
import { useUserData } from "@/hooks/useUserData";
import { updateUser } from "@/services/users";
import { sendFollowNotification } from "@/services/notifications";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowBackIcon } from "@chakra-ui/icons";

const MotionFlex = motion(Flex);

const UserCard = ({
  user,
  isFollower,
  isFollowing,
  onFollow,
  onUnfollow,
  onClick,
}) => {
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    setLoading(true);
    await onFollow(user.uid);
    setLoading(false);
  };

  const handleUnfollow = async () => {
    setLoading(true);
    await onUnfollow(user.uid);
    setLoading(false);
  };

  const handleAction = isFollowing ? handleUnfollow : handleFollow;

  return (
    <MotionFlex
      direction={"column"}
      padding={"20px"}
      w={"300px"}
      bg={"gray.50"}
      borderRadius={"15px"}
      boxShadow={"xl"}
      mb={"20px"}
      pos={"relative"}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <Button
        pos={"absolute"}
        right={"10px"}
        top={"10px"}
        isLoading={loading}
        onClick={handleAction}
        colorScheme={isFollowing ? "red" : "teal"}
        variant="outline"
        _hover={{ bg: isFollowing ? "red.50" : "teal.50" }}
      >
        {isFollowing ? "Siguiendo" : "Seguir"}
      </Button>
      <Heading fontSize={"22px"} mb={"10px"} color={"teal.700"}>
        {user.name}
      </Heading>
      <Text fontSize={"16px"} mb={"5px"} color={"gray.600"}>
        {user.email}
      </Text>
      <Text fontSize={"14px"} color={"gray.500"}>
        {isFollower ? "Te sigue" : "No te sigue"}
      </Text>
    </MotionFlex>
  );
};

export default function CommunityPage() {
  const { userData, loading: userDataLoading, setUserData } = useUserData();
  const { users, loading, setUsers } = useUsers();
  const [selectedUser, setSelectedUser] = useState(null);

  const isLoaded = !loading && !userDataLoading;

  const onFollow = async (uid) => {
    const updatedUsers = users.map((user) => {
      if (user.uid === uid) {
        return {
          ...user,
          followers: [...user.followers, userData.uid],
        };
      }
      return user;
    });

    await updateUser(uid, {
      followers: updatedUsers.find((user) => user.uid === uid).followers,
    });

    await updateUser(userData.uid, {
      following: [...userData.following, uid],
    });

    await sendFollowNotification(uid, userData.name);

    setUserData({
      ...userData,
      following: [...userData.following, uid],
    });

    setUsers(updatedUsers);
  };

  const onUnfollow = async (uid) => {
    const updatedUsers = users.map((user) => {
      if (user.uid === uid) {
        return {
          ...user,
          followers: user.followers.filter(
            (follower) => follower !== userData.uid
          ),
        };
      }
      return user;
    });

    await updateUser(uid, {
      followers: updatedUsers.find((user) => user.uid === uid).followers,
    });

    await updateUser(userData.uid, {
      following: userData.following.filter((following) => following !== uid),
    });

    setUserData({
      ...userData,
      following: userData.following.filter((following) => following !== uid),
    });

    setUsers(updatedUsers);
  };

  return (
    <Skeleton isLoaded={isLoaded} h={"100%"} w={"100%"} borderRadius={"10px"}>
      <Flex padding={"5%"} direction={"column"} h={"100%"} bg={"gray.100"}>
        <Heading
          fontWeight={400}
          fontSize={"40px"}
          mb={"20px"}
          color={"teal.700"}
          textAlign={"center"}
        >
          Comunidad
        </Heading>
        <Box
          w={"100%"}
          h={"100%"}
          overflowY={"auto"}
          padding={"20px"}
          borderRadius={"12px"}
          bg={"white"}
          boxShadow={"2xl"}
        >
          <Flex wrap={"wrap"} w={"100%"} justify={"space-between"} h={"90%"}>
            {!selectedUser &&
              users
                .filter((user) => user.uid !== userData?.uid)
                .map((user) => (
                  <UserCard
                    key={user.uid}
                    user={user}
                    isFollowing={user?.followers?.includes(userData?.uid)}
                    isFollower={user.following?.includes(userData?.uid)}
                    onFollow={onFollow}
                    onUnfollow={onUnfollow}
                    onClick={() => setSelectedUser(user)}
                  />
                ))}
            {selectedUser && (
              <Flex
                w={"100%"}
                h={"100%"}
                align={"center"}
                gap={"50px"}
                px={"20px"}
                position={"relative"}
              >
                <Button
                  colorScheme={"teal"}
                  variant={"outline"}
                  onClick={() => setSelectedUser(null)}
                  gap={"10px"}
                  position={"absolute"}
                  bottom={"0px"}
                  right={"20px"}
                >
                  <ArrowBackIcon />
                  Volver
                </Button>
                <Avatar
                  name={`${selectedUser.name} ${selectedUser.lastName}`}
                  src={selectedUser.photoURL}
                  h={"400px"}
                  w={"400px"}
                />
                <Flex direction={"column"}>
                  <Text fontSize={"6xl"}>
                    {selectedUser.name} {selectedUser.lastName}
                  </Text>
                  <Text fontSize={"2xl"} color="#4a5568" mb={"15px"}>
                    {selectedUser.isAuthor ? "Autor" : "Lector"}
                  </Text>
                  <Text fontSize={"lg"} color="#4a5568" mb={"15px"}>
                    <strong>Email:</strong> {selectedUser.email}
                  </Text>
                  <Text fontSize={"lg"} color="#4a5568" mb={"15px"}>
                    <strong>Edad:</strong> {selectedUser.age || "No disponible"}
                  </Text>
                  <Text fontSize={"lg"} color="#4a5568" mb={"20px"}>
                    <strong>Géneros Favoritos:</strong>{" "}
                    {selectedUser?.genres?.length > 0
                      ? selectedUser.genres
                          .map((genre) => genre.label)
                          .join(", ")
                      : "No disponible"}
                  </Text>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Box>
      </Flex>
    </Skeleton>
  );
}
