import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useRooms } from "@/features/rooms/hooks/useRooms";
import { Button } from "@/shared/components/ui/button";
import { Calendar } from "@/shared/components/ui/calendar";
import { Checkbox } from "@/shared/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import type { DialogProps } from "@/shared/interfaces/DialogProps";
import { cn } from "cn";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import { useSearchParams } from "react-router";
import type { Temporal } from "temporal-polyfill";
import { APPOINTMENT_STATUS_LABELS } from "../enum/AppointmentStatusEnum";
import { useCreateAppointments } from "../hooks/useCreateAppointments";
import { useUpdateAppointment } from "../hooks/useUpdateAppointment";
import type { AppointmentFormData } from "../schema/appointmentSchema";

interface AppointmentDialogProps extends DialogProps {
  startDate: Temporal.PlainDate | null;
  register: UseFormRegister<AppointmentFormData>;
  handleSubmit: UseFormHandleSubmit<AppointmentFormData>;
  control: Control<AppointmentFormData>;
  errors: FieldErrors<AppointmentFormData>;
  reset: UseFormReset<AppointmentFormData>;
}

export function AppointmentDialog({
  setOpen,
  open,
  register,
  handleSubmit,
  control,
  errors,
  reset,
}: AppointmentDialogProps) {
  const [params, _setParams] = useSearchParams();
  const { createAppointments } = useCreateAppointments();
  const { updateAppointment } = useUpdateAppointment();

  const { rooms } = useRooms();
  const { customers } = useCustomers();
  const updateMode = params.get("mode") === "update";
  const id = Number(params.get("id"));

  const onSubmit = (data: AppointmentFormData) => {
    console.log(data);
    const payload = {
      ...data,
      data: format(data.data, "yyyy-MM-dd"),
      fim: data.fim,
    };

    if (updateMode) {
      updateAppointment({ id, data: payload });
    } else {
      createAppointments(payload);
    }
  };

  const dialogText = updateMode
    ? {
        title: "Editar reserva",
        description: "Atualize os dados da reserva.",
        button: "Salvar",
      }
    : {
        title: "Nova reserva",
        description: "Preencha os dados da nova reserva.",
        button: "Criar",
      };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          reset({});
        }
        setOpen(next);
      }}
    >
      <DialogContent
        className={cn(
          "rounded-xs min-w-[60%] max-h-[90%] overflow-hidden grid grid-rows-[auto_minmax(0,1fr)_auto]",
        )}
      >
        <DialogHeader>
          <DialogTitle>{dialogText.title}</DialogTitle>
          <DialogDescription>{dialogText.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="min-h-0">
          <form
            onSubmit={handleSubmit(onSubmit)}
            id="reservation-form"
            className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4"
          >
            <Controller
              control={control}
              name="cliente_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Cliente</FieldLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <SelectTrigger id="cliente_id" className="w-full">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((client) => (
                        <SelectItem
                          key={client.id}
                          value={client.id.toString()}
                        >
                          {client.nome_empresa}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors?.cliente_id?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="sala_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Sala</FieldLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value ? field.value.toString() : undefined}
                  >
                    <SelectTrigger id="sala_id" className="w-full">
                      <SelectValue placeholder="Selecione uma sala" />
                    </SelectTrigger>
                    <SelectContent>
                      {rooms.map((r) => (
                        <SelectItem key={r.id} value={r.id.toString()}>
                          {r.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors?.sala_id?.message}</FieldError>
                </Field>
              )}
            />
            <Controller
              control={control}
              name="data"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Data</FieldLabel>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal rounded-md h-9"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          (() => {
                            return format(field.value, "dd/MM/yyyy");
                          })()
                        ) : (
                          <span>Selecione a data</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                  <FieldError>{errors?.data?.message}</FieldError>
                </Field>
              )}
            />

            <FieldGroup className="grid grid-cols-2 gap-2">
              <Field>
                <FieldLabel>Início</FieldLabel>
                <Input id="inicio" type="time" {...register("inicio")} />
                <FieldError>{errors?.inicio?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Fim</FieldLabel>
                <Input id="fim" type="time" {...register("fim")} />
                <FieldError>{errors?.fim?.message}</FieldError>
              </Field>
            </FieldGroup>

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(APPOINTMENT_STATUS_LABELS).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ),
                      )}
                    </SelectContent>
                  </Select>
                  <FieldError>{errors?.status?.message}</FieldError>
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Finalidade</FieldLabel>
              <Input
                id="finalidade"
                type="text"
                placeholder="Ex: Reunião com cliente"
                {...register("finalidade")}
              />
              <FieldError>{errors?.finalidade?.message}</FieldError>
            </Field>

            <Field className="col-span-2">
              <FieldLabel>Observação</FieldLabel>
              <Textarea
                id="observacao"
                placeholder="Observações adicionais"
                {...register("observacao")}
              />
              <FieldError>{errors?.observacao?.message}</FieldError>
            </Field>

            <FieldDescription className="flex flex-row gap-2 items-center">
              <Controller
                control={control}
                name="contratual"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label>Contratual</Label>
            </FieldDescription>
          </form>
        </ScrollArea>

        <DialogFooter className="flex flex-row  justify-between items-center w-full">
          {/* This button need to cancel the meetings, fix it later */}
          {/* {updateMode && (
            <div className="flex-1">
              <Button
                variant="ghost"
                className="hover:bg-red-600/10"
                onClick={() => ???(id)}
              >
                <Trash color={"#c10007"} />
              </Button>
            </div>
          )} */}
          <div className="flex flex-row gap-3">
            <Button form="reservation-form" type="submit" variant="outline">
              {dialogText.button}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Fechar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
