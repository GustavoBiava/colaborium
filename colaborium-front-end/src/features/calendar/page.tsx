import { PageLayout } from "@/shared/components/layout/PageLayout";
import { AppointmentView } from "./components/AppointmentView";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { AppointmentDialog } from "./components/AppointmentDialog";
import type { Temporal } from "temporal-polyfill";

export function CalendarPage() {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Temporal.PlainDate | null>(null);

  return (
    <PageLayout
      pageTitle="Agenda"
      Icon={CalendarIcon}
      subtitle="Acompanhe o uso das salas de reunião por aqui"
    >
      <AppointmentView
        setOpenCalendar={setOpenCalendar}
        setStartDate={setStartDate}
      />
      {openCalendar && (
        <AppointmentDialog
          setOpen={setOpenCalendar}
          open={openCalendar}
          startDate={startDate}
        />
      )}
    </PageLayout>
  );
}
