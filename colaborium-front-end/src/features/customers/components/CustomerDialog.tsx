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
import { Label } from "@/shared/components/ui/label";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import type { DialogProps } from "@/shared/interfaces/DialogProps";
import { formatCep } from "@/shared/utils/formatCep";
import { formatCpfCnpj } from "@/shared/utils/formatCpfCnpj";
import { formatPhone } from "@/shared/utils/formatPhone";
import { cn } from "cn";

import type {
  Control,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
} from "react-hook-form";
import { Controller, type FieldErrors } from "react-hook-form";
import { useSearchParams } from "react-router";
import type { CustomerFormData } from "../schema/customerSchema";

interface CustomerDialogProps extends DialogProps {
  register: UseFormRegister<CustomerFormData>;
  control: Control<CustomerFormData>;
  errors: FieldErrors<CustomerFormData>;
  handleSubmit: UseFormHandleSubmit<CustomerFormData>;
  onSubmit: (data: CustomerFormData) => void;
  onInvalid: (errors: FieldErrors<CustomerFormData>) => void;
  tab: "empresa" | "representante";
  setTab: (value: "empresa" | "representante") => void;
  reset: UseFormReset<CustomerFormData>;
}

export function CustomerDialog({
  setOpen,
  open,
  register,
  control,
  errors,
  handleSubmit,
  onSubmit,
  onInvalid,
  tab,
  setTab,
  reset,
}: CustomerDialogProps) {
  const [params, _setParams] = useSearchParams();

  const mode = params.get("mode");
  const id = params.get("id");
  const dialogText =
    mode === "update"
      ? {
          title: "Editar cliente",
          description: "Atualize os dados do cliente.",
          button: "Salvar",
        }
      : id
        ? {
            title: "Visualizar cliente",
            description: "Dados do cliente selecionado.",
            button: "Fechar",
          }
        : {
            title: "Novo cliente",
            description: "Preencha os dados do novo cliente.",
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
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            id="customer-form"
            className="gap-x-5 gap-y-4 mb-4 pr-4 mt-2 ml-1"
          >
            <Tabs
              value={tab}
              onValueChange={(value) =>
                setTab(value as "empresa" | "representante")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="empresa">Empresa</TabsTrigger>

                <TabsTrigger value="representante">Representante</TabsTrigger>
              </TabsList>

              <TabsContent value="empresa" className="grid grid-cols-2 gap-3">
                <Field>
                  <FieldLabel>Nome</FieldLabel>
                  <Input
                    id="nome_empresa"
                    type="text"
                    placeholder="Ex: Empresa Ficcional LTDA"
                    {...register("nome_empresa")}
                  />
                  <FieldError>{errors?.nome_empresa?.message}</FieldError>
                </Field>
                <FieldGroup className="grid grid-cols-[1fr_30%] gap-2">
                  <Field>
                    <FieldLabel>Endereço</FieldLabel>
                    <Input
                      id="endereco_empresa"
                      type="text"
                      placeholder="Rua"
                      {...register("endereco_empresa")}
                    />
                    <FieldError>{errors?.endereco_empresa?.message}</FieldError>
                  </Field>
                  <Field>
                    <FieldLabel>Número</FieldLabel>
                    <Input
                      id="numero_empresa"
                      type="text"
                      placeholder="Número"
                      {...register("numero_empresa")}
                    />
                    <FieldError>{errors?.numero_empresa?.message}</FieldError>
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
                    id="bairro_empresa"
                    type="text"
                    placeholder="Ex: Centro"
                    {...register("bairro_empresa")}
                  />
                  <FieldError>{errors?.bairro_empresa?.message}</FieldError>
                </Field>

                <Controller
                  control={control}
                  name="cpf_cnpj_empresa"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>CNPJ/CPF</FieldLabel>
                      <Input
                        id="cpf_cnpj_empresa"
                        type="text"
                        placeholder="000.000.000-00"
                        maxLength={14 + 4} // 14 from the phone + special characters
                        onChange={(e) => {
                          field.onChange(formatCpfCnpj(e.target.value));
                        }}
                        value={field.value}
                      />
                      <FieldError>
                        {errors?.cpf_cnpj_empresa?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel>Cidade</FieldLabel>
                  <Input
                    id="cidade_empresa"
                    type="text"
                    placeholder="Ex: São Paulo"
                    {...register("cidade_empresa")}
                  />
                  <FieldError>{errors?.cidade_empresa?.message}</FieldError>
                </Field>
                <Controller
                  control={control}
                  name="telefone"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Telefone</FieldLabel>
                      <Input
                        id="telefone_empresa"
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
                    id="estado_empresa"
                    type="text"
                    placeholder="Ex: SP"
                    {...register("estado_empresa")}
                  />
                  <FieldError>{errors?.estado_empresa?.message}</FieldError>
                </Field>

                <Controller
                  control={control}
                  name="cep_empresa"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>CEP</FieldLabel>

                      <Input
                        id="cep_empresa"
                        type="text"
                        placeholder="00000-000"
                        maxLength={9 + 1}
                        onChange={(e) => {
                          field.onChange(formatCep(e.target.value));
                        }}
                        value={field.value}
                      />
                      <FieldError>{errors?.cep_empresa?.message}</FieldError>
                    </Field>
                  )}
                />
                <Field>
                  <FieldLabel>Complemento</FieldLabel>
                  <Input
                    id="complemento_empresa"
                    type="text"
                    placeholder="Ex: Sala 201"
                    {...register("complemento_empresa")}
                  />
                  <FieldError>
                    {errors?.complemento_empresa?.message}
                  </FieldError>
                </Field>
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
                      defaultValue={false}
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
              </TabsContent>

              <TabsContent
                value="representante"
                className="grid grid-cols-2  gap-3"
              >
                <Field>
                  <FieldLabel>Nome</FieldLabel>
                  <Input
                    id="nome_representante"
                    type="text"
                    placeholder="Ex: João Silva"
                    {...register("nome_representante")}
                  />
                  <FieldError>{errors?.nome_representante?.message}</FieldError>
                </Field>

                <FieldGroup className="grid grid-cols-[1fr_30%] gap-2">
                  <Field>
                    <FieldLabel>Endereço</FieldLabel>
                    <Input
                      id="endereco_representante"
                      type="text"
                      placeholder="Rua"
                      {...register("endereco_representante")}
                    />
                    <FieldError>
                      {errors?.endereco_representante?.message}
                    </FieldError>
                  </Field>

                  <Field>
                    <FieldLabel>Número Rep.</FieldLabel>
                    <Input
                      id="numero_representante"
                      type="text"
                      placeholder="Número"
                      {...register("numero_representante")}
                    />
                    <FieldError>
                      {errors?.numero_representante?.message}
                    </FieldError>
                  </Field>
                </FieldGroup>

                <Field>
                  <FieldLabel>Nacionalidade</FieldLabel>
                  <Input
                    id="nacionalidade_representante"
                    type="text"
                    placeholder="Ex: Brasileiro"
                    {...register("nacionalidade_representante")}
                  />
                  <FieldError>
                    {errors?.nacionalidade_representante?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Estado Civil</FieldLabel>
                  <Input
                    id="estado_civil_representante"
                    type="text"
                    placeholder="Ex: Solteiro"
                    {...register("estado_civil_representante")}
                  />
                  <FieldError>
                    {errors?.estado_civil_representante?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Cargo</FieldLabel>
                  <Input
                    id="cargo_representante"
                    type="text"
                    placeholder="Ex: Analista financeiro"
                    {...register("cargo_representante")}
                  />
                  <FieldError>
                    {errors?.cargo_representante?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Bairro</FieldLabel>
                  <Input
                    id="bairro_representante"
                    type="text"
                    placeholder="Ex: Centro"
                    {...register("bairro_representante")}
                  />
                  <FieldError>
                    {errors?.bairro_representante?.message}
                  </FieldError>
                </Field>

                <Controller
                  control={control}
                  name="cpf_representante"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>CPF</FieldLabel>
                      <Input
                        id="cpf_representante"
                        type="text"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        onChange={(e) => {
                          field.onChange(formatCpfCnpj(e.target.value));
                        }}
                        value={field.value}
                      />
                      <FieldError>
                        {errors?.cpf_representante?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel>Cidade</FieldLabel>
                  <Input
                    id="cidade_representante"
                    type="text"
                    placeholder="Ex: São Paulo"
                    {...register("cidade_representante")}
                  />
                  <FieldError>
                    {errors?.cidade_representante?.message}
                  </FieldError>
                </Field>

                <Field>
                  <FieldLabel>Estado</FieldLabel>
                  <Input
                    id="estado_representante"
                    type="text"
                    placeholder="Ex: SP"
                    {...register("estado_representante")}
                  />
                  <FieldError>
                    {errors?.estado_representante?.message}
                  </FieldError>
                </Field>

                <Controller
                  control={control}
                  name="cep_representante"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>CEP</FieldLabel>

                      <Input
                        id="cep_representante"
                        type="text"
                        placeholder="00000-000"
                        maxLength={9 + 1}
                        onChange={(e) => {
                          field.onChange(formatCep(e.target.value));
                        }}
                        value={field.value}
                      />
                      <FieldError>
                        {errors?.cep_representante?.message}
                      </FieldError>
                    </Field>
                  )}
                />

                <Field>
                  <FieldLabel>Complemento</FieldLabel>
                  <Input
                    id="complemento_representante"
                    type="text"
                    placeholder="Ex: Casa"
                    {...register("complemento_representante")}
                  />
                  <FieldError>
                    {errors?.complemento_representante?.message}
                  </FieldError>
                </Field>
              </TabsContent>
            </Tabs>
          </form>
        </ScrollArea>

        <DialogFooter>
          <Button form="customer-form" type="submit" variant="outline">
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
