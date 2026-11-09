import { PageLayout } from "@/shared/components/layout/PageLayout";
import { CalendarView } from "./components/CalendarView";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { CalendarDialog } from "./components/CalendarDialog";

export function CalendarPage() {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  return (
    <PageLayout
      pageTitle="Agenda"
      Icon={CalendarIcon}
      subtitle="Acompanhe o uso das salas de reunião por aqui"
    >
      <CalendarView setOpenCalendar={setOpenCalendar} />
      {openCalendar && (
        <CalendarDialog setOpen={setOpenCalendar} open={openCalendar} />
      )}
    </PageLayout>
  );
}
