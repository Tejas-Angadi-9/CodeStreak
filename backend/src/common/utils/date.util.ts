const IST_TIME_ZONE = 'Asia/Kolkata';

export function getTodaysDate(): string {
  const todaysDate = new Date().toLocaleDateString('en-CA', { timeZone: IST_TIME_ZONE });
  return todaysDate;
}
