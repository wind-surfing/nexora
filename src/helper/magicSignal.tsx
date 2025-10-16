export function generateMagicSignal(length = 3): string {
  const chars = "abcdefghijklmnopqrstuvwyz";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
