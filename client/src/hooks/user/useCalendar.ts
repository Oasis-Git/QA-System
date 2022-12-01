import axios from "axios";
import { useEffect, useState } from "react";
import { PATH_API_USER } from "../../routes/paths";
import { ApiResponse } from "../../types/ApiResponse";
import { QuestionStatus } from "../../types/Question";

type Event = {
  id: string;
  title: string;
  status: QuestionStatus;
  deadline: Date;
};

const useCalendar = (): Event[] => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    axios
      .get(PATH_API_USER.calendar)
      .then(response => {
        const data = response.data as ApiResponse<{ events: Event[] }>;
        setEvents(data.data.events);
      })
      .catch(exception => {
        console.log(exception);
        throw exception;
      });
  }, []);

  return events;
};
export default useCalendar;
