export default function formatMillisToTime(milliseconds, type) {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));

  // Menghasilkan format jam:menit:detik
  const formattedTime = `${hours.toString().padStart(2, "0")} jam ${minutes
    .toString()
    .padStart(2, "0")} menit`;

  if (type) {
    if (type == "hour") {
      return hours;
    }
    if (type == "minute") {
      return minutes;
    }
    return "";
  }
  return formattedTime;
}
