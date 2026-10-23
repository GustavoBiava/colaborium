import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface DialogProps {
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

export function ClientDialog({ setOpen, open }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Card com fundo borrado</DialogTitle>
          <DialogDescription>Descricao</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
      <p>asdmklasdksakdj</p>
    </Dialog>
  );
}
