export function parseTimestamp<T extends { timestamp: string | Date }>(item: T): T & { timestamp: Date } {
  return {
    ...item,
    timestamp: item.timestamp instanceof Date ? item.timestamp : new Date(item.timestamp),
  };
}

export function parseTimestamps<T extends { timestamp: string | Date }>(items: T[]): (T & { timestamp: Date })[] {
  return items.map((item) => parseTimestamp(item));
}
