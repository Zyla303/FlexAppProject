import { createContext, useState, FC, ReactNode } from "react";
import { Group } from "../hooks/use-group-queries";
import { Room } from "../hooks/use-room-queries";

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
  chosenGroup: Group | undefined;
  chosenRoom: Room | undefined;
  chosenView: ViewType;

  authenticateUser: (userData: UserData) => void;
  deauthenticateUser: () => void;
  setChosenGroup: (id: Group | undefined) => void;
  setChosenRoom: (id: Room | undefined) => void;
  setChosenView: (view: ViewType) => void;
}

const defaultValues: AppContextType = {
  loggedUserData: undefined,

  chosenView: "profile",
  chosenGroup: undefined,
  chosenRoom: undefined,

  authenticateUser: () => undefined,
  deauthenticateUser: () => undefined,
  setChosenGroup: () => undefined,
  setChosenRoom: () => undefined,
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
  const [chosenGroup, setChosenGroup] = useState<Group | undefined>(undefined);
  const [chosenRoom, setChosenRoom] = useState<Room | undefined>(undefined);
  const [chosenView, setChosenView] = useState<ViewType>(
    defaultValues.chosenView
  );

  const authenticateUser = (userData: UserData) => {
    setLoggedUserData(userData);
  };

  const deauthenticateUser = async () => {
    setLoggedUserData(undefined);
    setChosenGroup(undefined);
    setChosenRoom(undefined);
    localStorage.removeItem("userId");
  };

  return (
    <AppContext.Provider
      value={{
        loggedUserData,
        chosenGroup,
        chosenRoom,
        chosenView,

        // login,
        // register,
        authenticateUser,
        deauthenticateUser,
        setChosenGroup,
        setChosenRoom,
        setChosenView,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
