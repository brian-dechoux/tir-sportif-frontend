import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function formatWithLocale(date: string, dateFormat: string): string {
  return format(new Date(date), dateFormat, { locale: fr });
}
