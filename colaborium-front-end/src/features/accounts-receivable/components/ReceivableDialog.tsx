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
import { useCustomers } from "@/features/customers/hooks/useCustomers";
import type { DialogProps } from "@/shared/interfaces/DialogProps";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  receivableSchema,
  type ReceivableFormData,
} from "../schema/receivableSchema";
import { getApiErrorMessage } from "../utils/getApiErrorMessage";
import { todayIso } from "../utils/formatDate";

interface ReceivableDialogProps extends DialogProps {
  onSubmit: (data: ReceivableFormData) => Promise<unknown>;
}

const buildDefaults = (): Partial<ReceivableFormData> => ({
  descricao: "",
  data_emissao: todayIso(),
});

export function ReceivableDialog({
  open,
  setOpen,
  onSubmit,
}: ReceivableDialogProps) {
  const { customers } = useCustomers({ limit: "all" });

  const {
    register,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ReceivableFormData>({
    resolver: zodResolver(receivableSchema),
    defaultValues: buildDefaults(),
  });

  const submit = async (data: ReceivableFormData) => {
    try {
      await onSubmit(data);
      reset(buildDefaults());
      setOpen(false);
    } catch (error) {
      setError("root", { message: getApiErrorMessage(error) });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset(buildDefaults());
        setOpen(next);
      }}
    >
      <DialogContent className="rounded-xs min-w-[40%]">
        <DialogHeader>
          <DialogTitle>Nova conta</DialogTitle>
          <DialogDescription>
            Preencha os dados da nova conta a receber.
          </DialogDescription>
        </DialogHeader>

        <form
          id="receivable-form"
          onSubmit={handleSubmit(submit)}
          className="grid grid-cols-2 gap-x-5 gap-y-4"
        >
          <Controller
            control={control}
            name="cliente_id"
            render={({ field }) => (
              <Field className="col-span-2">
                <FieldLabel>Cliente</FieldLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : undefined}
                >
                  <SelectTrigger id="cliente_id" className="w-full">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.id.toString()}
                      >
                        {customer.nome_empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError>{errors.cliente_id?.message}</FieldError>
              </Field>
            )}
          />

          <Field className="col-span-2">
            <FieldLabel>Documento</FieldLabel>
            <Input
              id="descricao"
              type="text"
              placeholder="Ex: NF 1021 ou Boleto 334"
              {...register("descricao")}
            />
            <FieldError>{errors.descricao?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Valor</FieldLabel>
            <Input
              id="valor"
              type="number"
              step="0.01"
              min="0"
              placeholder="0,00"
              {...register("valor", { valueAsNumber: true })}
            />
            <FieldError>{errors.valor?.message}</FieldError>
          </Field>

          <div />

          <Field>
            <FieldLabel>Emissão</FieldLabel>
            <Input
              id="data_emissao"
              type="date"
              {...register("data_emissao")}
            />
            <FieldError>{errors.data_emissao?.message}</FieldError>
          </Field>

          <Field>
            <FieldLabel>Vencimento</FieldLabel>
            <Input
              id="data_vencimento"
              type="date"
              {...register("data_vencimento")}
            />
            <FieldError>{errors.data_vencimento?.message}</FieldError>
          </Field>

          {errors.root && (
            <FieldError className="col-span-2">
              {errors.root.message}
            </FieldError>
          )}
        </form>

        <DialogFooter>
          <Button
            form="receivable-form"
            type="submit"
            variant="outline"
            disabled={isSubmitting}
          >
            Criar
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
