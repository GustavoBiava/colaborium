import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";
import { Calendar } from "@/shared/components/ui/calendar";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import { useAvailableRooms } from "@/features/rooms/hooks/useAvailableRooms";
import { addMonths, format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { useEffect } from "react";
import {
  contractSchema,
  type ContractFormData,
} from "../schema/contractSchema";

const OBSERVATION_LIMIT = 500;

type ContractFormProps = {
  onSubmit: (data: ContractFormData) => void;
};

export default function ContractCreationForm({ onSubmit }: ContractFormProps) {
  const { customers } = useCustomers({ limit: "all" });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ContractFormData>({
    resolver: zodResolver(contractSchema),
  });

  const periodo = watch("periodo");
  const startDate = watch("data_inicio");
  const endDate = watch("data_fim");
  const observacao = watch("observacao") ?? "";

  const now = new Date();
  const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    if (!startDate || !periodo) {
      setValue("data_fim", "");
      return;
    }

    const computedEnd = addMonths(
      new Date(`${startDate}T00:00:00`),
      periodo
    );

    setValue("data_fim", format(computedEnd, "yyyy-MM-dd"));
  }, [startDate, periodo, setValue]);

  const salasEnabled = Boolean(startDate && periodo && endDate);

  const {
    rooms,
    isLoading: isLoadingRooms,
  } = useAvailableRooms(
    salasEnabled ? startDate : undefined,
    salasEnabled ? endDate : undefined
  );

  const salas = watch("salas") ?? [];

  useEffect(() => {
    if (salas.length === 0) {
      setValue("salas", [0]);
    }
  }, [salas.length, setValue]);

  function handleSalaChange(index: number, value: number) {
    const next = [...salas];
    next[index] = value;
    setValue("salas", next);
  }

  function handleAddSala() {
    setValue("salas", [...salas, 0]);
  }

  function handleRemoveSala(index: number) {
    setValue(
      "salas",
      salas.filter((_, i) => i !== index),
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      id="contract-creation-form"
      className="grid grid-cols-2 gap-3"
    >
      <Field>
        <FieldLabel>Cliente</FieldLabel>
        <Controller
          control={control}
          name="cliente_id"
          render={({ field }) => (
            <Select
              onValueChange={(value) => field.onChange(Number(value))}
              value={field.value ? field.value.toString() : undefined}
            >
              <SelectTrigger id="cliente_id" className="w-full">
                <SelectValue placeholder="Selecione um cliente" />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id.toString()}>
                    {customer.nome_empresa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError>{errors?.cliente_id?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Período (meses)</FieldLabel>
        <Input
          id="periodo"
          type="number"
          min={1}
          max={12}
          step={1}
          placeholder="Ex: 6"
          {...register("periodo", { valueAsNumber: true })}
        />
        <FieldError>{errors?.periodo?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Data de início</FieldLabel>
        <Input
          id="data_inicio"
          type="date"
          lang="pt-BR"
          min={today}
          {...register("data_inicio")}
        />
        <FieldError>{errors?.data_inicio?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Data de fim</FieldLabel>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled
              className="w-full justify-start text-left font-normal rounded-md h-9"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {endDate ? (
                format(new Date(`${endDate}T00:00:00`), "dd/MM/yyyy")
              ) : (
                <span>Preencha início e período</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar
              mode="single"
              selected={endDate ? new Date(`${endDate}T00:00:00`) : undefined}
            />
          </PopoverContent>
        </Popover>
        <input type="hidden" {...register("data_fim")} />
        <FieldError>{errors?.data_fim?.message}</FieldError>
      </Field>

      <Field className="col-span-2">
        <FieldLabel>Salas</FieldLabel>
        <div className="flex flex-col gap-2">
          {salas.map((salaId, index) => (
            <div key={index} className="flex flex-row gap-2">
              <Select
                disabled={!salasEnabled}
                onValueChange={(value) =>
                  handleSalaChange(index, Number(value))
                }
                value={salaId ? salaId.toString() : undefined}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      !salasEnabled
                        ? "Preencha o período primeiro"
                        : "Selecione uma sala"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {rooms
                    .filter(
                      (room) =>
                        room.id === salaId || !salas.includes(room.id),
                    )
                    .map((room) => (
                      <SelectItem key={room.id} value={room.id.toString()}>
                        {room.nome}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {salas.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-sm"
                  onClick={() => handleRemoveSala(index)}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={!salasEnabled}
          className="w-fit"
          onClick={handleAddSala}
        >
          <Plus size={16} />
          Adicionar sala
        </Button>
        {salasEnabled && !isLoadingRooms && rooms.length === 0 && (
          <span className="text-xs text-red-500">
            Nenhuma sala disponível nesse período
          </span>
        )}
        <FieldError>{errors?.salas?.message}</FieldError>
      </Field>

      <Field>
        <FieldLabel>Valor</FieldLabel>
        <Input
          id="valor_base"
          type="number"
          placeholder="0"
          min={0}
          step="0.01"
          {...register("valor_base", { valueAsNumber: true })}
        />
        <FieldError>{errors?.valor_base?.message}</FieldError>
      </Field>

      <Field className="col-span-2">
        <FieldLabel>Observação</FieldLabel>
        <Textarea
          id="observacao"
          maxLength={OBSERVATION_LIMIT}
          {...register("observacao")}
          className="wrap-break-words resize-none w-full h-32"
        />
        <span
          className={`self-end text-xs ${observacao.length >= OBSERVATION_LIMIT ? "text-red-500" : "text-muted-foreground"}`}
        >
          {observacao.length} / {OBSERVATION_LIMIT}
        </span>
      </Field>
    </form>
  );
}
