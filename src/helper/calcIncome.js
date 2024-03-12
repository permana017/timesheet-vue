export function calculateCost(hours, minutes, hourlyRate) {
  console.log(hourlyRate);
  const totalMinutes = Math.floor(hours) * 60 + Math.floor(minutes);
  const cost = totalMinutes * (Math.floor(hourlyRate) / 60);
  return cost;
}
