import {
  Dialog as DialogUi,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "./ui/button";

interface DialogProps {
  title: string;
  description?: string;
  open: boolean;
  setOpen: (value: React.SetStateAction<boolean>) => void;
}

export function Dialog({ open, setOpen, title, description }: DialogProps) {
  return (
    <DialogUi open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </DialogUi>
  );
}
