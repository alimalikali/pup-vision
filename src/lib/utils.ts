import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatEnumLabel(value: string | undefined | null): string {
  if (!value) return ''
  return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
}
