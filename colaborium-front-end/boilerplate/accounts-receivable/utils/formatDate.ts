// "2026-11-05" -> "05/11/2026". não usa Date, evita erro de fuso
export function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const [year, month, day] = iso.slice(0, 10).split("-");
  return `${day}/${month}/${year}`;
}

// data de hoje local em YYYY-MM-DD (valor de <input type="date">)
export function todayIso(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}
