import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

import { Textarea } from "@/shared/components/ui/textarea";
import { Label } from "@/shared/components/ui/label";
import { useState } from "react";

interface ContractCancelAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (reason: string) => void;
}

export function ContractCancelAlertDialog({open, onOpenChange, onConfirm}: ContractCancelAlertDialogProps) {
    const [reasoning, setReasoning] = useState("");

    function handleOpenChange(nextOpen: boolean) {
        onOpenChange(nextOpen);

        if (!nextOpen) {
            setReasoning("");
        }
    }

    function handleConfirm() {
        const trimmedReasoning = reasoning.trim();

        if (!trimmedReasoning) return;

        onConfirm(trimmedReasoning);
        setReasoning("");
    }

    return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Cancelar contrato?
                    </AlertDialogTitle>

                    <AlertDialogDescription>
                        Informe o motivo do cancelamento:
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="cancel-reasoning">
                        Motivo do cancelamento
                    </Label>

                    <Textarea
                        id="cancel-reasoning"
                        placeholder="Descreva o motivo..."
                        value={reasoning}
                        onChange={(e) => setReasoning(e.target.value)}
                        maxLength={500}
                        className="resize-none"
                    />

                    <p className="text-xs text-muted-foreground text-right">
                        {reasoning.length}/500
                    </p>
                </div>

                    <AlertDialogDescription>
                        Aviso: Essa ação não poderá ser desfeita.
                    </AlertDialogDescription>

                <AlertDialogFooter>
                    <AlertDialogCancel>
                        Voltar
                    </AlertDialogCancel>

                    <AlertDialogAction onClick={handleConfirm} disabled={!reasoning.trim()}>
                        Confirmar cancelamento
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}