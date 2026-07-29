// Admin panel displays timestamps in Toronto time regardless of where the
// server is physically deployed (Railway runs this app in US West / UTC).
export function formatTorontoDateTime(date: Date): string {
  return date.toLocaleString("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Toronto",
  });
}
