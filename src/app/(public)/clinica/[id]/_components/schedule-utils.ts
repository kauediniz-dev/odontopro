export function isToday(date: Date) {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isSlotThePast(slotTime: string) {
  const [slotHour, slotMinute] = slotTime.split(":").map(Number);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  if (slotHour < currentHour) {
    return true;
  } else if (slotHour === currentHour && slotMinute <= currentMinute) {
    return true;
  }

  return false;
}
