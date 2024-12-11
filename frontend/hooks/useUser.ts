import { useUserContext } from "@/context/UserContext";

// Custom hook for consuming the UserContext
export const useUser = () => {
  const { user, loading, setUser, logoutUser } = useUserContext();

  return { user, loading, setUser, logoutUser };
};
