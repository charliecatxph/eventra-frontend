export const getUnix = (date: string, time: string): number => {
  const [year, month, day] = date.split("-");
  const [hours, minutes] = time.split(":");
  const datetime = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  );
  return Math.floor(datetime.getTime() / 1000);
};
