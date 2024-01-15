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
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { useAppContext } from "../context/useAppContext";
import { useReservationQueries } from "../hooks/use-reservation-queries";

interface BookRoomFormValues {
  reason: string;
  description: string;
  date: string;
}

export const ParticularRoomContent: FC = () => {
  const { register, handleSubmit } = useForm<BookRoomFormValues>();
  const { chosenRoomId = "" } = useAppContext();
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().set("minutes", 60).set("seconds", 0)
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(
    dayjs().set("minutes", 60).set("seconds", 0)
  );

  const {
    reservations: { data: reservations = [] },
    createReservation: {
      mutate: createReservation,
      status: createReservationStatus,
    },
  } = useReservationQueries(chosenRoomId);

  const onSubmit = (data: BookRoomFormValues) => {
    createReservation({
      reason: data.reason,
      description: data.description,
      roomId: chosenRoomId,
      dateFrom: startDate?.toISOString() ?? "",
      dateTo: endDate?.toISOString() ?? "",
    });
  };

  return (
    <>
      <Card className="particular-room-top-panel">
        <div className="room-title">
          <p title="Group name">Group name</p>
          <p title="Room name">Room name</p>
        </div>
        <div className="button-container">
          <Button label="Remove group" />
        </div>
      </Card>

      <ExpandableCard
        header="Reservations"
        className="reservations-panel"
        defaultState
      >
        <i>Click to view full information</i>
        {reservations.map((reservation) => (
          <ExpandableRow {...reservation} />
        ))}
      </ExpandableCard>

      <ExpandableCard header="Book" defaultState className="book-room-panel">
        <form className="book-room-form" onSubmit={handleSubmit(onSubmit)}>
          <div className="divided-content">
            <div className="left-side">
              <p className="details-text">Give us details about your booking</p>
              <Input label="Reason" {...register("reason")} />
              <TextArea label="Description" {...register("description")} />
            </div>

            <div className="right-side">
              <p className="details-text">
                Pick a proper date and time for your booking
              </p>
              <DateTimePicker
                label="Start Reservation"
                views={["year", "month", "day", "hours"]}
                format="DD/MM/YYYY HH:mm"
                minDate={dayjs()}
                value={startDate}
                onChange={(date) => setStartDate(date)}
              />
              <DateTimePicker
                label="End Reservation"
                views={["year", "month", "day", "hours"]}
                format="DD/MM/YYYY HH:mm"
                minDate={dayjs()}
                value={endDate}
                onChange={(date) => setEndDate(date)}
              />
              <StatusInfo
                status={createReservationStatus}
                message="Unable to book!"
                secondaryMessage="Please pick a different date"
              />
            </div>
          </div>
          <Button className="book-button" label="Book" />
        </form>
      </ExpandableCard>
    </>
  );
};
