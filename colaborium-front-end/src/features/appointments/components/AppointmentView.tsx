import FullCalendar, {
  type DateSelectInfo,
  type EventClickInfo,
} from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/react/daygrid";
import interactionPlugin from "@fullcalendar/react/interaction";
import formaThemePlugin from "@fullcalendar/react/themes/forma";
import timeGridPlugin from "@fullcalendar/react/timegrid";

import "@fullcalendar/react/skeleton.css";
import "@fullcalendar/react/themes/forma/palettes/blue.css";
import "@fullcalendar/react/themes/forma/theme.css";
import type { UseFormReset } from "react-hook-form";
import { useSearchParams } from "react-router";
import { Temporal } from "temporal-polyfill";
import { useAppointments } from "../hooks/useAppointments";
import type { AppointmentFormData } from "../schema/appointmentSchema";
import { appointmentToEvent } from "../utils/appointmentToEvent";

interface AppointmentViewProps {
  setOpenCalendar: (value: boolean) => void;
  setStartDate: (date: Temporal.PlainDate) => void;
  onEventClick(info: EventClickInfo): void;
  reset: UseFormReset<AppointmentFormData>;
}

export function AppointmentView({
  setOpenCalendar,
  setStartDate,
  onEventClick,
  reset,
}: AppointmentViewProps) {
  const { appointments } = useAppointments();
  const [_params, setParams] = useSearchParams();

  function handleSelect(info: DateSelectInfo) {
    setParams({ mode: "create" });
    reset({});
    setStartDate(Temporal.PlainDate.from(info.startStr.slice(0, 10)));
    setOpenCalendar(true);
  }

  function handleEventClick(info: EventClickInfo) {
    setParams({ mode: "update", id: info.event.id });
    setOpenCalendar(true);
    onEventClick(info);
  }

  return (
    <>
      <FullCalendar
        selectable
        editable
        initialView="dayGridMonth"
        events={appointments.map((ap) => appointmentToEvent(ap))}
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
    </>
  );
}
