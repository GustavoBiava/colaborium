import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { DialogProps } from "@/shared/interfaces/DialogProps";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  settleReceivableSchema,
  type SettleReceivableFormData,
} from "../schema/settleReceivableSchema";
import type { ReceivableResponse } from "../types/ReceivableResponse";
import { formatCurrency } from "../utils/formatCurrency";
import { todayIso } from "../utils/formatDate";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { PAYMENT_METHODS } from "../utils/receivableStatus";

interface SettleDialogProps extends DialogProps {
  receivable: ReceivableResponse | null;
  onSubmit: (data: SettleReceivableFormData) => Promise<unknown>;
}

const buildDefaults = (
  receivable: ReceivableResponse | null,
): SettleReceivableFormData => ({
  data_pagamento: todayIso(),
  forma_pagamento: "PIX",
  juros: 0,
  multa: 0,
  desconto: 0,
  valor_pago: receivable?.valor ?? 0,
});

const calcTotal = (
  valor: number,
  juros: number,
  multa: number,
  desconto: number,
): number =>
  Math.round((valor + (juros || 0) + (multa || 0) - (desconto || 0)) * 100) /
  100;

export function SettleDialog({
  open,
  setOpen,
  receivable,
  onSubmit,
}: SettleDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SettleReceivableFormData>({
    resolver: zodResolver(settleReceivableSchema),
    defaultValues: buildDefaults(receivable),
  });

  useEffect(() => {
    if (open) reset(buildDefaults(receivable));
  }, [open, receivable, reset]);

  const [juros, multa, desconto] = useWatch({
    control,
    name: ["juros", "multa", "desconto"],
  });

  useEffect(() => {
    if (!receivable) return;
    setValue("valor_pago", calcTotal(receivable.valor, juros, multa, desconto));
  }, [juros, multa, desconto, receivable, setValue]);

  const submit = async (data: SettleReceivableFormData) => {
    try {
      await onSubmit(data);
      setOpen(false);
    } catch (error) {
      setError("root", { message: getApiErrorMessage(error) });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="rounded-xs min-w-[40%]">
        <DialogHeader>
          <DialogTitle>Dar baixa</DialogTitle>
          <DialogDescription>
            {receivable
              ? `${receivable.cliente_nome} · ${receivable.descricao ?? "sem documento"} · ${formatCurrency(receivable.valor)}`
              : "Registre o recebimento da conta."}
          </DialogDescription>
        </DialogHeader>

        <form
          id="settle-form"
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-2 gap-x-5 gap-y-4"
        >
          <Field>
            <FieldLabel>Data do pagamento</FieldLabel>
            <Input
              id="data_pagamento"
              type="date"
              {...register("data_pagamento")}
            />
            <FieldError>{errors.data_pagamento?.message}</FieldError>
          </Field>

          <Controller
            control={control}
            name="forma_pagamento"
            render={({ field }) => (
              <Field>
                <FieldLabel>Forma de pagamento</FieldLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="forma_pagamento" className="w-full">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_METHODS.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.forma_pagamento?.message}</FieldError>
              </Field>
            )}
          />

          <Field>
            <FieldLabel>Juros</FieldLabel>
            <Input
              id="juros"
              type="number"
              step="0.01"
              min="0"
              {...register("juros", { valueAsNumber: true })}
            />
            <FieldError>{errors.juros?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Multa</FieldLabel>
            <Input
              id="multa"
              type="number"
              step="0.01"
              min="0"
              {...register("multa", { valueAsNumber: true })}
            />
            <FieldError>{errors.multa?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Desconto</FieldLabel>
            <Input
              id="desconto"
              type="number"
              step="0.01"
              min="0"
              {...register("desconto", { valueAsNumber: true })}
            />
            <FieldError>{errors.desconto?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Valor pago</FieldLabel>
            <Input
              id="valor_pago"
              type="number"
              step="0.01"
              min="0"
              {...register("valor_pago", { valueAsNumber: true })}
            />
            <FieldError>{errors.valor_pago?.message}</FieldError>
          </Field>

          {errors.root && (
            <FieldError className="col-span-2">
              {errors.root.message}
            </FieldError>
          )}
        </form>

        <DialogFooter>
          <Button
            form="settle-form"
            type="submit"
            variant="outline"
            disabled={isSubmitting}
          >
            Confirmar baixa
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
