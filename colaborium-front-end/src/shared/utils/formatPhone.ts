export const formatPhone = (value: string) => {
  const cleanedValue = value.replace(/\D/g, "");

  return cleanedValue
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};
