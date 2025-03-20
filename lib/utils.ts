import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function formatDate(dateString: string | Date): string {
  if (!dateString) return "N/A"

  const date = typeof dateString === "string" ? new Date(dateString) : dateString

  if (isNaN(date.getTime())) return "Invalid date"

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
