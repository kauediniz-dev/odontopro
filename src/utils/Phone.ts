export function formatPhoneNumber(value: string) {
  // Remove tudo que não for dígito
  const cleanedValue = value.replace(/\D/g, "");
  // Verifica se o número tem 11 dígitos (formato brasileiro)
  if (cleanedValue.length > 11) {
    return value.slice(0, 15);
  }

  // Aplicar a Mascara
  const formattedValue = cleanedValue
    .replace(/^(\d{2})(\d)/g, "($1) $2")
    .replace(/(\d{4,5})(\d{4})$/, "$1-$2");
  return formattedValue;
}

export function extractPhoneNumber(phone: string) {
  const phoneValue = phone.replace(/[\(\)\s-]/g, "");
  return phoneValue;
}
