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
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { cn } from "cn";
import { useSearchParams } from "react-router";

interface DialogProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

export function ClientDialog({ setOpen, open }: DialogProps) {
  const [params, _setParams] = useSearchParams();
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className={cn("rounded-xs min-w-[60%]")}>
        <DialogHeader>
          <DialogTitle>{dialogText.title}</DialogTitle>
          <DialogDescription>{dialogText.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-row gap-5 mb-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input id="name" type="text" placeholder="Ex: João Silva" />
            </Field>
            <Field>
              <FieldLabel>E-mail</FieldLabel>
              <Input id="name" type="text" placeholder="exemplo@email.com" />
            </Field>
            <Field>
              <FieldLabel>CNPJ/CPF</FieldLabel>
              <Input id="cnpj_cpf" type="text" placeholder="000.000.000-00" />
            </Field>
            <Field>
              <FieldLabel>Telefone</FieldLabel>
              <Input id="telefone" type="text" placeholder="(00) 00000-0000" />
            </Field>
            <Field>
              <FieldLabel>CEP</FieldLabel>
              <Input id="cep" type="text" placeholder="00000-000" />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <FieldGroup className="grid grid-cols-[1fr_30%] gap-2">
              <Field>
                <FieldLabel>Endereço</FieldLabel>
                <Input id="endereco" type="text" placeholder="Rua" />
              </Field>
              <Field className="">
                <FieldLabel>Número</FieldLabel>
                <Input id="numero" type="text" placeholder="Número" />
              </Field>
            </FieldGroup>
            <Field>
              <FieldLabel>Bairro</FieldLabel>
              <Input id="bairro" type="text" placeholder="Ex: Centro" />
            </Field>
            <Field>
              <FieldLabel>Cidade</FieldLabel>
              <Input id="cidade" type="text" placeholder="Ex: São Paulo" />
            </Field>
            <Field>
              <FieldLabel>Estado</FieldLabel>
              <Input id="estado" type="text" placeholder="Ex: SP" />
            </Field>
            <Field>
              <FieldLabel>IE</FieldLabel>
              <Input id="ie" type="text" placeholder="Isento ou número" />
              <FieldDescription className="flex flex-row gap-2 items-center">
                <Checkbox />
                <Label>Isento</Label>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
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
