let counter = 0;

export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  counter++;
  return `${Date.now().toString(36)}-${counter}-${Math.random().toString(36).substring(2, 8)}`;
}
