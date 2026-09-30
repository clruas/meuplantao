export function isShiftDay(startDate, dateToCheck) {
  const start = new Date(startDate);
  const check = new Date(dateToCheck);

  const msPerDay = 1000 * 60 * 60 * 24;
  const diffInDays = Math.round((check - start) / msPerDay);

  return diffInDays % 2 === 0; // par = dia de plantão, ímpar = folga
}
