/**
 * Format a date to a string in YYYY-MM-DD format or custom format
 * @param date - The date to format
 * @param options - Optional formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date, options?: Intl.DateTimeFormatOptions): string {
  if (options) {
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
  
  // Default format: YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * Parse a date string in YYYY-MM-DD format
 * @param dateString - The date string to parse
 * @returns Date object
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * Get the name of the day of the week
 * @param date - The date object
 * @param format - 'long' for full name (e.g., "Monday"), 'short' for abbreviated (e.g., "Mon")
 * @returns Day of the week as a string
 */
export function getDayOfWeek(date: Date, format: 'long' | 'short' = 'long'): string {
  return date.toLocaleDateString('en-US', { weekday: format });
}

/**
 * Get an array of dates for the current week
 * @param referenceDate - The reference date to get the week for, defaults to today
 * @param startOnMonday - Whether the week should start on Monday (true) or Sunday (false)
 * @returns Array of Date objects for each day of the week
 */
export function getWeekDates(referenceDate: Date = new Date(), startOnMonday: boolean = true): Date[] {
  const result: Date[] = [];
  const date = new Date(referenceDate);
  const day = date.getDay();
  
  // Calculate the start of the week
  const diff = startOnMonday ? day - 1 : day;
  date.setDate(date.getDate() - diff - (diff < 0 ? -7 : 0));
  
  // Generate the 7 days of the week
  for (let i = 0; i < 7; i++) {
    result.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  
  return result;
}

/**
 * Format a date range as a string
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startMonth = startDate.toLocaleDateString('en-US', { month: 'short' });
  const endMonth = endDate.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();
  
  if (startYear !== endYear) {
    return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
  }
  
  if (startMonth !== endMonth) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  }
  
  return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
}

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns True if the date is today, false otherwise
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
