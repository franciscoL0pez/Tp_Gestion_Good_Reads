import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import { useEffect, useState } from "react";
import { getUser } from "@/services/users";

export const useUserData = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (!mounted) {
      return setMounted(true);
    }

    if (user) {
      setLoading(true);
      getUser(user.uid).then((data) => {
        setUserData(data);
        setLoading(false);
      });
    }
  }, [mounted, user]);

  return { loading, userData };
};
