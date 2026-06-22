export function money(value: number) {
  return new Intl.NumberFormat('vi-VN').format(value);
}

export function compactPhone(phone: string) {
  return phone.replace(/[.\s]/g, '');
}
