import { PageLayout } from "@/shared/components/layout/PageLayout";
import { CalendarView } from "./components/CalendarView";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { CalendarDialog } from "./components/CalendarDialog";
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
      <CalendarView
        setOpenCalendar={setOpenCalendar}
        setStartDate={setStartDate}
      />
      {openCalendar && (
        <CalendarDialog
          setOpen={setOpenCalendar}
          open={openCalendar}
          startDate={startDate}
        />
      )}
    </PageLayout>
  );
}
