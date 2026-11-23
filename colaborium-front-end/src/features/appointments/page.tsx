import { PageLayout } from "@/shared/components/layout/PageLayout";
import type { EventClickInfo } from "@fullcalendar/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Temporal } from "temporal-polyfill";
import { AppointmentDialog } from "./components/AppointmentDialog";
import { AppointmentView } from "./components/AppointmentView";
import {
  appointmentSchema,
  type AppointmentFormData,
} from "./schema/appointmentSchema";
import { Button } from "@/shared/components/ui/button";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { Label } from "@/shared/components/ui/label";
import { useSearchParams } from "react-router";

export function CalendarPage() {
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Temporal.PlainDate | null>(null);
  const [incluirCancelados, setIncluirCancelados] = useState<boolean>(false);
  const [_params, setParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (startDate) {
      setValue(
        "data",
        new Date(startDate.year, startDate.month - 1, startDate.day),
      );
    }
  }, [startDate]);

  function handleEventClick(info: EventClickInfo) {
    setOpenCalendar(true);
    reset(info.event.extendedProps);
  }

  return (
    <PageLayout
      pageTitle="Agenda"
      className="gap-3"
      Icon={CalendarIcon}
      subtitle="Acompanhe o uso das salas de reunião por aqui"
    >
      <div className="flex flex-row gap-5 w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Checkbox
            id="incluir-cancelados"
            checked={incluirCancelados}
            onCheckedChange={(checked) => setIncluirCancelados(checked === true)}
          />
          <Label htmlFor="incluir-cancelados">Mostrar cancelados</Label>
        </div>
        <Button
          onClick={() => {
            setOpenCalendar(true);
            setParams({ mode: "create" });
          }}
          className="w-36"
        >
          <Plus size={18} />
          <p>Evento</p>
        </Button>
      </div>

      <AppointmentView
        onEventClick={handleEventClick}
        setOpenCalendar={setOpenCalendar}
        setStartDate={setStartDate}
        reset={reset}
        incluirCancelados={incluirCancelados}
      />
      {openCalendar && (
        <AppointmentDialog
          setOpen={setOpenCalendar}
          open={openCalendar}
          startDate={startDate}
          register={register}
          handleSubmit={handleSubmit}
          control={control}
          errors={errors}
          reset={reset}
        />
      )}
    </PageLayout>
  );
}
