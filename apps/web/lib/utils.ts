import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, isOverseas: boolean = false) {
  if (isOverseas) {
    return `$ ${amount}`
  }
  return `Rp ${amount.toLocaleString('id-ID')}`
}
