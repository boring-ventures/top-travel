export const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

export const formatShortDate = (date: Date) => {
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
};

export const isSameDay = (date1: Date, date2: Date) => {
  return new Date(date1).toDateString() === new Date(date2).toDateString();
};

export const calculateDuration = (startDate: Date, endDate: Date) => {
  return Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );
};

export const formatDuration = (duration: number) => {
  return `${duration} ${duration === 1 ? "día" : "días"}`;
};

