import FullCalendar from "@fullcalendar/react"; // => request placed at the top
import listPlugin from "@fullcalendar/list";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import timelinePlugin from "@fullcalendar/timeline";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useRef, useEffect } from "react";
// material
import { useTheme } from "@mui/material/styles";
import { Card, Container, useMediaQuery } from "@mui/material";
// redux

// routes
import { PATH_DASHBOARD } from "../../routes/paths";
// @types
import { CalendarView } from "../../types/user/calendar";
// components
import Page from "../../components/general/Page";
import HeaderBreadcrumbs from "../../components/general/HeaderBreadcrumbs";
import { CalendarStyle, CalendarToolbar } from "../../components/user/calendar";
import useCalendar from "../../hooks/user/useCalendar";

// ----------------------------------------------------------------------

export default function Calendar(): JSX.Element {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const calendarRef = useRef<FullCalendar>(null);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>(
    isMobile ? "listWeek" : "dayGridMonth"
  );
  const events = useCalendar();

  const chooseColor = function (x: string): string {
    if (x === "待接单") {
      return "#1890FF";
    } else if (x === "回答中") {
      return "#A0522D";
    } else if (x === "已回答") {
      return "#800080";
    } else {
      return "#808080";
    }
  };

  const agendas = events.map(event => ({
    title: event.title,
    description: event.id,
    textColor: chooseColor(event.status.toString()),
    allDay: false,
    start: new Date(event.deadline).getTime() - 3600000,
    end: new Date(event.deadline),
  }));

  useEffect(() => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      const newView = isMobile ? "listWeek" : "dayGridMonth";
      calendarApi.changeView(newView);
      setView(newView);
    }
  }, [isMobile]);

  const handleClickToday = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.today();
      setDate(calendarApi.getDate());
    }
  };

  const handleChangeView = (newView: CalendarView) => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.changeView(newView);
      setView(newView);
    }
  };

  const handleClickDatePrev = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.prev();
      setDate(calendarApi.getDate());
    }
  };

  const handleClickDateNext = () => {
    const calendarEl = calendarRef.current;
    if (calendarEl) {
      const calendarApi = calendarEl.getApi();
      calendarApi.next();
      setDate(calendarApi.getDate());
    }
  };

  return (
    <Page title="日历">
      <Container maxWidth={"xl"}>
        <HeaderBreadcrumbs
          heading="日历"
          links={[
            { name: "个人中心", href: PATH_DASHBOARD.profile },
            { name: "日历" },
          ]}
        />

        <Card>
          <CalendarStyle>
            <CalendarToolbar
              date={date}
              view={view}
              onNextDate={handleClickDateNext}
              onPrevDate={handleClickDatePrev}
              onToday={handleClickToday}
              onChangeView={handleChangeView}
            />
            <FullCalendar
              weekends
              events={agendas}
              ref={calendarRef}
              rerenderDelay={10}
              initialDate={date}
              initialView={view}
              dayMaxEventRows={3}
              eventDisplay="block"
              headerToolbar={false}
              allDayMaintainDuration
              height={isMobile ? "auto" : 720}
              plugins={[
                listPlugin,
                dayGridPlugin,
                timelinePlugin,
                timeGridPlugin,
                interactionPlugin,
              ]}
            />
          </CalendarStyle>
        </Card>
      </Container>
    </Page>
  );
}
