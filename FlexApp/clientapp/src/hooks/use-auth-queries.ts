import { useMutation, useQuery } from "@tanstack/react-query";
import { get, post, put } from "../http-factory";
import { UserData } from "../context/appContext";
import { AxiosError } from "axios";

interface RegisterFormValues {
  userName: string;
  firstName: string;
  lastName: string;
  password: string;
  repeatedPassword: string;
}

interface ChangePassword {
  currentPassword: string;
  newPassword: string;
  userId: string;
}

const noop = () => {};

export const useAuthQueries = ({
  onLogin = noop,
  onLogout = noop,
}: {
  onLogin?: (userData: UserData) => void;
  onLogout?: () => void;
}) => {
  const userId = localStorage.getItem("userId");

  const setLocalStorageUserId = (userId: string) => {
    localStorage.setItem("userId", userId);
  };

  const { mutate: login } = useMutation({
    mutationFn: (data: Partial<UserData>) => post("/app/login", data),
    onSuccess: (userId: string) => {
      setLocalStorageUserId(userId);
    },
  });

  const { mutate: register } = useMutation({
    mutationFn: ({
      userName,
      firstName,
      lastName,
      password,
    }: RegisterFormValues) =>
      post("/app/register", {
        userName,
        firstName,
        lastName,
        password,
      }),
    onSuccess: (userId: string) => {
      setLocalStorageUserId(userId);
    },
  });

  const changePassword = useMutation<
    ChangePassword,
    AxiosError,
    ChangePassword
  >({
    mutationFn: ({ userId, currentPassword, newPassword }: ChangePassword) =>
      put("/app/ChangeUserPassword", {
        userId,
        currentPassword,
        newPassword,
      }),
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => post("/app/logout"),
    onSuccess: () => {
      onLogout();
    },
  });

  const { isLoading: isLoginLoading, isError } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: async ({ queryKey }) => {
      const [, userId] = queryKey;
      const userData = await get(`/app/GetUserInformations/${userId}`);

      onLogin({ ...userData });

      return userData;
    },

    enabled: !!userId,
    retry: false,
  });

  if (isError && !isLoginLoading) {
    localStorage.removeItem("userId");
  }

  return { login, logout, register, changePassword };
};
