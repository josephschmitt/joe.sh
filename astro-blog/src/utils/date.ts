import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getMonth(date: Date): string {
  return format(date, 'MMM');
}

export function getDay(date: Date): string {
  return format(date, 'd');
}

export function getYear(date: Date): string {
  return format(date, 'yyyy');
}
