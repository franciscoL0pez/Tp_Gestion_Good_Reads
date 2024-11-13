import { useEffect, useState } from "react";
import { getUsers } from "@/services/users";

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      return setMounted(true);
    }

    getUsers()
      .then((users) => {
        setUsers(users);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error getting users:", error);
        setLoading(false);
      });
  }, [mounted]);

  return { users, loading, setUsers };
};
