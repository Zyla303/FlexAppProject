import { FC, useState } from "react";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import "../styles/particular-group-room-content.scss";
import { ExpandableCard } from "../components/ExpandableCard";
import { Input } from "../components/Input";
import { StatusInfo } from "../components/StatusInfo";
import { TextArea } from "../components/TextArea";
import { ExpandableRow } from "../components/ExpandableRow";
import { useForm } from "react-hook-form";
import { DateTimePicker, DateTimeValidationError } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useAppContext } from "../context/useAppContext";
import { useReservationQueries } from "../hooks/use-reservation-queries";
import { useRoomQueries } from "../hooks/use-room-queries";
import * as utc from "dayjs/plugin/utc";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface BookRoomFormValues {
  reason: string;
  description: string;
}

dayjs.extend(utc);

const schema = yup
  .object()
  .shape({
    reason: yup.string().required("Reason is required"),
    description: yup.string().required("Description is required"),
  })
  .required();

const createReservationStatusMessages = {
  idle: {
    primary: "",
    secondary: "",
  },
  pending: {
    primary: "",
    secondary: "",
  },
  error: {
    primary: "Couldn't create new reservation",
    secondary: "Please pick a different date",
  },
  success: { primary: "Reservation created successfully", secondary: "" },
};

export const ParticularRoomContent: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<BookRoomFormValues>({
    mode: "all",
    resolver: yupResolver(schema),
  });

  const { loggedUserData, chosenRoom, chosenGroup, setChosenRoom } =
    useAppContext();

  const initialDate = dayjs().minute(60).second(0).millisecond(0);

  const [startDate, setStartDate] = useState<Dayjs | null>(initialDate);
  const [endDate, setEndDate] = useState<Dayjs | null>(initialDate);
  const [dateError, setDateError] = useState<DateTimeValidationError>();

  const {
    reservations: { data: reservations = [] },
    createReservation: {
      mutate: createReservation,
      status: createReservationStatus,
    },
    deleteReservation: { mutate: deleteReservation },
  } = useReservationQueries(chosenRoom?.id);

  const {
    deleteRoom: { mutate: deleteRoom },
  } = useRoomQueries();

  const handleDeleteRoom = () => {
    deleteRoom({
      id: chosenRoom?.id ?? "",
    });
    setChosenRoom(undefined);
  };

  const onSubmit = (data: BookRoomFormValues) => {
    createReservation({
      reason: data.reason,
      description: data.description,
      roomId: chosenRoom?.id ?? "",
      dateFrom: startDate?.utc().local().format() ?? "",
      dateTo: endDate?.utc().local().format() ?? "",
    });
    reset();
  };

  const handleDeleteReservation = (id: string) => {
    deleteReservation({
      id: id ?? "",
    });
  };

  return (
    <>
      <Card className="particular-room-top-panel">
        <div className="room-title">
          <p title="Group name">{chosenGroup?.name}</p>
          <p title="Room name">{chosenRoom?.name}</p>
        </div>
        <div className="button-container">
          <Button label="Remove room" onClick={handleDeleteRoom} />
        </div>
      </Card>

      <ExpandableCard
        header="Reservations"
        className="reservations-panel"
        defaultState
      >
        {reservations.length > 0 ? (
          <>
            <i>Click to view full information</i>
            {reservations.map((reservation) => (
              <div key={reservation.id}>
                <ExpandableRow {...reservation} />
                {loggedUserData?.id === reservation.createdById && (
                  <Button
                    style={{ marginTop: "10px" }}
                    label="Remove Reservation"
                    onClick={() => handleDeleteReservation(reservation.id)}
                  />
                )}
              </div>
            ))}
          </>
        ) : (
          "No reservations found"
        )}
      </ExpandableCard>

      <ExpandableCard header="Book" defaultState className="book-room-panel">
        <form className="book-room-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="divided-content">
            <div className="left-side">
              <p className="details-text">Give us details about your booking</p>
              <Input
                label="Reason"
                errorMessage={errors.reason?.message}
                {...register("reason")}
              />
              <TextArea
                label="Description"
                errorMessage={errors.description?.message}
                {...register("description")}
              />
            </div>

            <div className="right-side">
              <p className="details-text">
                Pick a proper date and time for your booking
              </p>
              <DateTimePicker
                label="Start Reservation"
                views={["year", "month", "day", "hours"]}
                format="DD/MM/YYYY HH:mm"
                value={startDate}
                onChange={(date) => setStartDate(date)}
                minDateTime={initialDate}
                onError={(error) => setDateError(error)}
                ampm={false}
              />
              <DateTimePicker
                label="End Reservation"
                views={["year", "month", "day", "hours"]}
                format="DD/MM/YYYY HH:mm"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                onError={(error) => setDateError(error)}
                minDateTime={startDate}
                ampm={false}
              />
              <StatusInfo
                status={createReservationStatus}
                message={
                  createReservationStatusMessages[createReservationStatus]
                    .primary
                }
                secondaryMessage={
                  createReservationStatusMessages[createReservationStatus]
                    .secondary
                }
              />
            </div>
          </div>
          <Button
            className="book-button"
            label="Book"
            disabled={!isValid || !(Object.keys(dateError ?? {}).length === 0)}
          />
        </form>
      </ExpandableCard>
    </>
  );
};
