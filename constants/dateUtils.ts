// helpers/dateUtils.ts

export const getLast7Days = (latestDate: Date): Date[] => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(latestDate);
    date.setDate(latestDate.getDate() - i);
    days.push(date);
  }
  return days;
};

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  return `${day}/${month}`;
};
