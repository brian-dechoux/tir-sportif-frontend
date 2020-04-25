import { format } from 'date-fns-tz';
import { dateTheme } from 'configurations/theme.configuration';

export function formatString(date: string, dateFormat: string): string {
  return formatDate(new Date(date), dateFormat);
}

export function formatDate(date: Date, dateFormat: string): string {
  return format(date, dateFormat, { locale: dateTheme.locale, timeZone: dateTheme.timeZone });
}
