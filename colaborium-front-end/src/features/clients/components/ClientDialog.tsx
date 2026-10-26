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
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { Label } from "@/shared/components/ui/label";
import { cn } from "cn";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { clientSchema, type ClientFormData } from "../schema/clientSchema";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatCpfCnpj } from "@/shared/utils/formatCpfCnpj";
import { formatPhone } from "@/shared/utils/formatPhone";
import { formatCep } from "@/shared/utils/formatCep";

interface DialogProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

export function ClientDialog({ setOpen, open }: DialogProps) {
  const [params, _setParams] = useSearchParams();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const dialogText =
    params.get("mode") === "update"
      ? {
          title: "Editar cliente",
          description: "Atualize os dados do cliente.",
          button: "Salvar",
        }
      : {
          title: "Novo cliente",
          description: "Preencha os dados do novo cliente.",
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
            id="client-form"
            className="grid grid-cols-2 gap-x-5 gap-y-4 mb-4 pr-4"
          >
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input
                id="name"
                type="text"
                placeholder="Ex: João Silva"
                {...register("name")}
              />
              <FieldError>{errors?.name?.message}</FieldError>
            </Field>
            <FieldGroup className="grid grid-cols-[1fr_30%] gap-2">
              <Field>
                <FieldLabel>Endereço</FieldLabel>
                <Input
                  id="endereco"
                  type="text"
                  placeholder="Rua"
                  {...register("endereco")}
                />
                <FieldError>{errors?.endereco?.message}</FieldError>
              </Field>
              <Field>
                <FieldLabel>Número</FieldLabel>
                <Input
                  id="numero"
                  type="text"
                  placeholder="Número"
                  {...register("numero")}
                />
                <FieldError>{errors?.numero?.message}</FieldError>
              </Field>
            </FieldGroup>

            <Field>
              <FieldLabel>E-mail</FieldLabel>
              <Input
                id="email"
                type="text"
                placeholder="exemplo@email.com"
                {...register("email")}
              />
              <FieldError>{errors?.email?.message}</FieldError>
            </Field>
            <Field>
              <FieldLabel>Bairro</FieldLabel>
              <Input
                id="bairro"
                type="text"
                placeholder="Ex: Centro"
                {...register("bairro")}
              />
              <FieldError>{errors?.bairro?.message}</FieldError>
            </Field>

            <Controller
              control={control}
              name="cnpj_cpf"
              render={({ field }) => (
                <Field>
                  <FieldLabel>CNPJ/CPF</FieldLabel>
                  <Input
                    id="cnpj_cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    maxLength={14 + 4} // 14 from the phone + special characters
                    onChange={(e) => {
                      field.onChange(formatCpfCnpj(e.target.value));
                    }}
                    value={field.value}
                  />
                  <FieldError>{errors?.cnpj_cpf?.message}</FieldError>
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Cidade</FieldLabel>
              <Input
                id="cidade"
                type="text"
                placeholder="Ex: São Paulo"
                {...register("cidade")}
              />
              <FieldError>{errors?.cidade?.message}</FieldError>
            </Field>
            <Controller
              control={control}
              name="telefone"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Telefone</FieldLabel>
                  <Input
                    id="telefone"
                    type="text"
                    maxLength={11 + 4} // 11 from the phone + special characters
                    placeholder="(00) 00000-0000"
                    onChange={(e) => {
                      field.onChange(formatPhone(e.target.value));
                    }}
                    value={field.value}
                  />
                  <FieldError>{errors?.telefone?.message}</FieldError>
                </Field>
              )}
            />

            <Field>
              <FieldLabel>Estado</FieldLabel>
              <Input
                id="estado"
                type="text"
                placeholder="Ex: SP"
                {...register("estado")}
              />
              <FieldError>{errors?.estado?.message}</FieldError>
            </Field>

            <Controller
              control={control}
              name="cep"
              render={({ field }) => (
                <Field>
                  <FieldLabel>CEP</FieldLabel>

                  <Input
                    id="cep"
                    type="text"
                    placeholder="00000-000"
                    maxLength={9 + 1}
                    onChange={(e) => {
                      field.onChange(formatCep(e.target.value));
                    }}
                    value={field.value}
                  />
                  <FieldError>{errors?.cep?.message}</FieldError>
                </Field>
              )}
            />
            <Field>
              <FieldLabel>Inscrição Estadual</FieldLabel>
              <Input
                id="ie"
                type="number"
                min={0}
                placeholder="Isento ou número"
                {...register("ie")}
              />
              <FieldError>{errors?.ie?.message}</FieldError>
              <FieldDescription className="flex flex-row gap-2 items-center">
                <Controller
                  control={control}
                  name="isento"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label>Isento</Label>
              </FieldDescription>
            </Field>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button form="client-form" type="submit" variant="outline">
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
