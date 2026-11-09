import FullCalendar, {
  type DateSelectInfo,
  type EventClickInfo,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import timeGridPlugin from "@fullcalendar/react/timegrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import formaThemePlugin from "@fullcalendar/react/themes/forma";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/forma/palettes/blue.css";
import "@fullcalendar/react/themes/forma/theme.css";
import { Temporal } from "temporal-polyfill";

type CalendarEvent = {
  id: string;
  title: string;
  start: string; // ISO string, FullCalendar want string/Date
  end?: string;
  allDay?: boolean;
};

const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: "1",
    title: "Reuniao Procer",
    start: Temporal.Now.plainDateISO().toString(),
  },
];

export function CalendarView({
  setOpenCalendar,
}: {
  setOpenCalendar: (value: boolean) => void;
}) {
  function handleSelect(info: DateSelectInfo) {
    const start = Temporal.PlainDate.from(info.startStr.slice(0, 10));
    setOpenCalendar(true);
  }

  function handleEventClick(info: EventClickInfo) {
    console.log("ecent click", info.event.id);
  }

  return (
    <FullCalendar
      selectable
      editable
      initialView="dayGridMonth"
      events={MOCK_EVENTS}
      select={handleSelect}
      eventClick={handleEventClick}
      locale="pt-br"
      height="90%"
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
        formaThemePlugin,
      ]}
      headerToolbar={{
        right: "prev,next today",
        center: "title",
        left: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
    />
  );
}
