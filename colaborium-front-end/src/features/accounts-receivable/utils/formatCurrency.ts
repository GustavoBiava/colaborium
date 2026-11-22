const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

// 1850 -> "R$ 1.850,00"
export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}
