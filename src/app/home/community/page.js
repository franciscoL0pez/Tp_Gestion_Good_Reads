"use client";

import { Button, Flex, Heading, Skeleton } from "@chakra-ui/react";
import { useUsers } from "@/hooks/useUsers";
import { useUserData } from "@/hooks/useUserData";
import { updateUser } from "@/services/users";
import { useState } from "react";

const UserCard = ({ user, isFollower, isFollowing, onFollow, onUnfollow }) => {
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
    <Flex
      direction={"column"}
      padding={"20px"}
      w={"300px"}
      bg={"white"}
      borderRadius={"12px"}
      boxShadow={"lg"}
      mb={"20px"}
      pos={"relative"}
    >
      <Button
        pos={"absolute"}
        right={"10px"}
        top={"10px"}
        isLoading={loading}
        onClick={handleAction}
        colorScheme={isFollowing ? "red" : "teal"}
      >
        {isFollowing ? "Siguiendo" : "Seguir"}
      </Button>
      <Heading fontSize={"20px"} mb={"15px"} color={"teal.600"}>
        {user.name}
      </Heading>
      <Heading fontSize={"16px"} mb={"15px"} color={"gray.600"}>
        {user.email}
      </Heading>
    </Flex>
  );
};

export default function CommunityPage() {
  const { userData, loading: userDataLoading, setUserData } = useUserData();
  const { users, loading, setUsers } = useUsers();

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
            (follower) => follower !== userData.uid,
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
      <Flex padding={"5%"} direction={"column"} h={"100%"}>
        <Heading fontWeight={400} fontSize={"40px"} mb={"20px"}>
          Comunidad
        </Heading>
        <Flex
          wrap={"wrap"}
          w={"100%"}
          justify={"space-between"}
          h={"90%"}
          overflowY={"auto"}
        >
          {users
            .filter((user) => user.uid !== userData?.uid)
            .map((user) => (
              <UserCard
                key={user.id}
                user={user}
                isFollowing={user?.followers?.includes(userData?.uid)}
                isFollower={user.following?.includes(userData?.uid)}
                onFollow={onFollow}
                onUnfollow={onUnfollow}
              />
            ))}
        </Flex>
      </Flex>
    </Skeleton>
  );
}
