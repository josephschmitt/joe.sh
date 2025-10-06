import { format } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMMM d, yyyy');
}

export function formatDateISO(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
