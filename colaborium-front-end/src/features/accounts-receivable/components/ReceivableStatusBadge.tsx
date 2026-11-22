import { cn } from "cn";
import type { ReceivableStatus } from "../types/ReceivableResponse";
import {
  RECEIVABLE_STATUS_BADGE_CLASS,
  RECEIVABLE_STATUS_LABEL,
} from "../utils/receivableStatus";

// props: status da conta
interface ReceivableStatusBadgeProps {
  status: ReceivableStatus;
}

// pílula colorida com o nome do status
export function ReceivableStatusBadge({ status }: ReceivableStatusBadgeProps) {
  return (
    <span
      className={cn(
        "px-2.5 py-2 text-xs font-semibold rounded-xs",
        RECEIVABLE_STATUS_BADGE_CLASS[status],
      )}
    >
      {RECEIVABLE_STATUS_LABEL[status]}
    </span>
  );
}
