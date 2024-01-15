import { FC } from "react";
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { useAppContext } from "./context/useAppContext";
import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { LoadingBoundary } from "./components/LoadingBoundary";
import "./styles/app.scss";

export const App: FC = () => {
  const { loggedUserData } = useAppContext();
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();

  return (
    <LoadingBoundary isLoading={!!isFetching || !!isMutating}>
      <div className="useless-app-div">
        {loggedUserData ? <HomePage /> : <LoginPage />}
      </div>
    </LoadingBoundary>
  );
};
