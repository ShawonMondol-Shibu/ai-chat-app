const SIZE_UNITS = ["Bytes", "KB", "MB", "GB"] as const;
const KILOBYTE = 1024;

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(KILOBYTE));
  const clampedIndex = Math.min(unitIndex, SIZE_UNITS.length - 1);
  const rounded = Math.round((bytes / Math.pow(KILOBYTE, clampedIndex)) * 100) / 100;
  return `${rounded} ${SIZE_UNITS[clampedIndex]}`;
}
