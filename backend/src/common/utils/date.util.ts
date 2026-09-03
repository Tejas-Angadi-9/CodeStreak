const IST_TIME_ZONE = 'Asia/Kolkata';

export function getTodaysDate(): string {
  const todaysDate = new Date().toLocaleDateString('en-CA', { timeZone: IST_TIME_ZONE });
  return todaysDate;
}

export function getWeekDates() {
  const dates: string[] = [];
  const currentDate = new Date(getTodaysDate());

  while (true) {
    const formattedDate = new Date(currentDate).toLocaleDateString('en-CA', {
      timeZone: IST_TIME_ZONE,
    });
    dates.push(formattedDate);

    if (currentDate.getDay() === 0) break;

    currentDate.setDate(currentDate.getDate() - 1);
  }

  return dates;
}
