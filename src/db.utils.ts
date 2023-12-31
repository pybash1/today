// CONSTANTS
const DAY_MS = 24 * 60 * 60 * 1000;
export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const fixDate = (date: Date | number) => {
  return new Date(
    new Date(date)
      .toJSON()
      .replace(/T(\d\d):(\d\d):(\d\d).(\d+)Z/g, "T00:00:00Z"),
  );
};

// EXPORTS
export const getDate = () => {
  return new Date()
    .toJSON()
    .replace(/T(\d\d):(\d\d):(\d\d).(\d+)Z/g, "T00:00:00Z");
};

export const getYesterday = () => {
  return new Date(Number(new Date()) - DAY_MS)
    .toJSON()
    .replace(/T(\d\d):(\d\d):(\d\d).(\d+)Z/g, "T00:00:00Z");
};

export const createWeekQuery = () => {
  const today = new Date(getDate());
  const day = today.getDay();
  const weekStart = fixDate(new Date(Number(today) - day * DAY_MS));
  const weekEnd = fixDate(new Date(Number(today) - (7 - day) * DAY_MS));

  let query: { date: string }[] = [];

  for (let i = Number(weekStart); i <= Number(weekEnd); i += DAY_MS) {
    query = query.concat([{ date: fixDate(i).toJSON() }]);
  }

  return query;
};

export const calculateStreak = (last: string) => {
  const today = new Date(getDate());
  const lastDay = new Date(last);

  const diff = Number(today) - Number(lastDay);

  return diff / DAY_MS;
};
