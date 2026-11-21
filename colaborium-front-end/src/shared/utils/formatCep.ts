export const formatCep = (value: string) => {
  const cleanedValue = value.replace(/\D/g, "");

  return cleanedValue
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};
