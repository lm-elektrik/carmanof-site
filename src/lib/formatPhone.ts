export function formatPhone(phone?: string): string {
  if (!phone) return "";

  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11 && digits.startsWith("7")) {
    return `+7 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }

  if (digits.length === 11 && digits.startsWith("8")) {
    return `8 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }

  return phone;
}
