import { createContext, useState, FC, ReactNode } from "react";

interface UserData {
    username: string;
}

type ViewType = 'profile' | 'groups';

interface AppContextType {
    // TODO zrobilem tak zeby po prostu miec po czym zrobic mockowa autentykacje, jak trzeba zmieniac jakies pola na ID itp to zmieniajcie
    loggedUserData: UserData | null;
    // TODO jak numbery są złe to sobie zmieńcie na string
    chosenGroupId: number | null;
    chosenRoomId: number | null;
    chosenView: ViewType;
    
    authenticateUser: (userData: UserData) => void;
    deauthenticateUser: () => void;
    setChosenGroupId: (id: number | null) => void;
    setChosenRoomId: (id: number | null) => void;
    setChosenView: (view: ViewType) => void;
}

const defaultValues: AppContextType = {
    loggedUserData: null,

    chosenView: 'profile',
    chosenGroupId: null,
    chosenRoomId: null,

    authenticateUser: () => null,
    deauthenticateUser: () => null,
    setChosenGroupId: () => null,
    setChosenRoomId: () => null,
    setChosenView: () => null
}

export const AppContext = createContext<AppContextType>(defaultValues);

interface AppContextProviderProps {
    children: ReactNode;
} 

export const AppContextProvider: FC<AppContextProviderProps> = ({children}) => {

    const [loggedUserData, setLoggedUserData] = useState<UserData | null>(null);
    const [chosenGroupId, setChosenGroupId] = useState<number | null>(null);
    const [chosenRoomId, setChosenRoomId] = useState<number | null>(null);
    const [chosenView, setChosenView] = useState<ViewType>(defaultValues.chosenView);


    const authenticateUser = (userData: UserData) => setLoggedUserData(userData);
    const deauthenticateUser = () => {
        setLoggedUserData(null);
        setChosenGroupId(null);
        setChosenRoomId(null);
    }

    return (
        <AppContext.Provider
            value={{
                loggedUserData,
                chosenGroupId,
                chosenRoomId,
                chosenView,

                authenticateUser,
                deauthenticateUser,
                setChosenGroupId,
                setChosenRoomId,
                setChosenView
            }}
        >
            {children}
        </AppContext.Provider>
    )
}