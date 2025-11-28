export function isSameUTCDate(dateString: string): boolean {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}
