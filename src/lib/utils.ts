import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(value: string) {
  if (!value) return ""
  value = value.replace(/\D/g, "")
  value = value.slice(0, 11)
  if (value.length > 10) {
    value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3")
  } else if (value.length > 5) {
    value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3")
  } else if (value.length > 2) {
    value = value.replace(/^(\d{2})(\d*)/, "($1) $2")
  } else {
    value = value.replace(/^(\d*)/, "($1")
  }
  return value
}
