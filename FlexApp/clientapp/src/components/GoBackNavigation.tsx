import { FC } from "react";
import { useAppContext } from "../context/useAppContext";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faAnglesLeft } from '@fortawesome/free-solid-svg-icons';
import { Card } from "./Card";

export const GoBackNavigation: FC = () => {
  const { chosenGroup, setChosenGroup, chosenRoom, setChosenRoom } =
    useAppContext();

  const goBack = () => {
    if (!chosenGroup?.id && !chosenRoom?.id) return;
    if (chosenGroup?.id && !chosenRoom?.id) setChosenGroup(undefined);
    if (chosenGroup?.id && chosenRoom?.id) setChosenRoom(undefined);
  };

  return (
    <Card className="go-back-navigation" onClick={() => goBack()}>
      {/*            <FontAwesomeIcon icon={faAnglesLeft}/>*/}
      <p>Go back</p>
    </Card>
  );
};
