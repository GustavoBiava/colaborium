import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { cn } from "cn";
import { useSearchParams } from "react-router";

interface DialogProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

export function ClientDialog({ setOpen, open }: DialogProps) {
  const [params] = useSearchParams();
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
      <DialogContent className={cn("rounded-xs")}>
        <DialogHeader>
          <DialogTitle>{dialogText.title}</DialogTitle>
          <DialogDescription>{dialogText.description}</DialogDescription>
        </DialogHeader>
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
