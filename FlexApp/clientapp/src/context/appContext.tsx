import { createContext, useState, FC, ReactNode } from "react";

export interface UserData {
  userName: string;
  firstName: string;
  lastName: string;
  id: string;
}

type ViewType = "profile" | "groups";

interface AppContextType {
  // TODO zrobilem tak zeby po prostu miec po czym zrobic mockowa autentykacje, jak trzeba zmieniac jakies pola na ID itp to zmieniajcie
  loggedUserData: Partial<UserData> | undefined;
  // TODO jak numbery są złe to sobie zmieńcie na string
  chosenGroupId: string | undefined;
  chosenRoomId: string | undefined;
  chosenView: ViewType;

  authenticateUser: (userData: UserData) => void;
  deauthenticateUser: () => void;
  setChosenGroupId: (id: string | undefined) => void;
  setChosenRoomId: (id: string | undefined) => void;
  setChosenView: (view: ViewType) => void;
}

const defaultValues: AppContextType = {
  loggedUserData: undefined,

  chosenView: "profile",
  chosenGroupId: undefined,
  chosenRoomId: undefined,

  authenticateUser: () => undefined,
  deauthenticateUser: () => undefined,
  setChosenGroupId: () => undefined,
  setChosenRoomId: () => undefined,
  setChosenView: () => undefined,
};

export const AppContext = createContext<AppContextType>(defaultValues);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({
  children,
}) => {
  const [loggedUserData, setLoggedUserData] = useState<
    Partial<UserData> | undefined
  >(undefined);
  const [chosenGroupId, setChosenGroupId] = useState<string | undefined>(
    undefined
  );
  const [chosenRoomId, setChosenRoomId] = useState<string | undefined>(
    undefined
  );
  const [chosenView, setChosenView] = useState<ViewType>(
    defaultValues.chosenView
  );

  const authenticateUser = (userData: UserData) => {
    setLoggedUserData(userData);
  };

  const deauthenticateUser = async () => {
    setLoggedUserData(undefined);
    setChosenGroupId(undefined);
    setChosenRoomId(undefined);
    localStorage.removeItem("userId");
  };

  return (
    <AppContext.Provider
      value={{
        loggedUserData,
        chosenGroupId,
        chosenRoomId,
        chosenView,

        // login,
        // register,
        authenticateUser,
        deauthenticateUser,
        setChosenGroupId,
        setChosenRoomId,
        setChosenView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
