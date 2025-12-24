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

export function formatMeaning(meaning: string): string {
  const array = meaning.split(":");
  return array[array.length - 1];
}
