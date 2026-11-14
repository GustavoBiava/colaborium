import { Button } from "@/shared/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Textarea } from "@/shared/components/ui/textarea";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Label } from "@/shared/components/ui/label";
import { cn } from "cn";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import {
  calendarSchema,
  type CalendarFormData,
} from "../schema/calendarSchema";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { DialogProps } from "@/shared/interfaces/DialogProps";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import type { Temporal } from "temporal-polyfill";
import { format } from "date-fns";

// DADOS MOCKADOS
const clients = [
  { id: "1", name: "Maria" },
  { id: "2", name: "João" },
];

const statusOptions = [
  { value: "pendente", label: "Pendente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
];

interface CalendarDialogProps extends DialogProps {
  startDate: Temporal.PlainDate | null;
}

export function CalendarDialog({
  setOpen,
  open,
  startDate,
}: CalendarDialogProps) {
  const [params, _setParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<CalendarFormData>({
    resolver: zodResolver(calendarSchema),
  });

  useEffect(() => {
    if (startDate) {
      setValue(
        "data",
        new Date(startDate.year, startDate.month - 1, startDate.day),
      );
    }
  }, [startDate]);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const dialogText =
    params.get("mode") === "update"
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

  useEffect(() => {
    console.log("erros", errors);
  }, [errors]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
            className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4 pr-4"
          >
            <Controller
              control={control}
              name="cliente_id"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Cliente</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger id="cliente_id" className="w-full">
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
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
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
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

        <DialogFooter>
          <Button form="reservation-form" type="submit" variant="outline">
            {dialogText.button}
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
