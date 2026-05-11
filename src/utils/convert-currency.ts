// - Valor em centavos = valor em reais * 100
// - Valor em reais = valor em centavos / 100

/**
 * Converte um valor em reais (string) para centavos (number).
 * @param {string} amount - O valor em reais a ser convertido.
 */

export function convertRealToCents(amount: string) {
  const numericPrice = parseFloat(amount.replace(/\D/g, "").replace(",", ".")); // Remove caracteres não numéricos
  const priceInCents = Math.round(numericPrice * 100); // Converte para centavos
  return priceInCents; // Converte para centavos
}
