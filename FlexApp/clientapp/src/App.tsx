import { FC } from "react";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { useAppContext } from "./context/useAppContext";
import "./styles/app.scss";

export const App: FC = () => {
  const { loggedUserData } = useAppContext();

  return (
    <div className="useless-app-div">
      {loggedUserData ? <HomePage /> : <LoginPage />}
    </div>
  );
};
