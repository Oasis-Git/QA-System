import { format, getTime, formatDistanceToNow } from "date-fns";

export function fDate(date: Date | string | number): string {
  return format(new Date(date), "yyyy MMM dd");
}

export function fDateTime(date: Date | string | number): string {
  return format(new Date(date), "yyyy MMM dd p");
}

export function fTimestamp(date: Date | string | number): number {
  return getTime(new Date(date));
}

export function fDateTimeSuffix(date: Date | string | number): string {
  return format(new Date(date), "yyyy/MM/dd hh:mm p");
}

export function fToNow(date: Date | string | number): string {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
}
