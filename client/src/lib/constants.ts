/**
 * Icons for different habit categories
 */
export const HABIT_ICONS = {
  health: "running",
  productivity: "briefcase",
  mindfulness: "brain",
  learning: "book",
  other: "star"
};

/**
 * Colors for different habit categories
 */
export const HABIT_COLORS = {
  health: "#4F46E5", // Primary
  productivity: "#10B981", // Green
  mindfulness: "#8B5CF6", // Purple
  learning: "#3B82F6", // Blue
  other: "#F59E0B" // Amber
};

/**
 * Default commitment level descriptions
 */
export const DEFAULT_LEVELS = {
  health: {
    micro: "5 min walk",
    standard: "15 min workout",
    stretch: "30 min intense workout"
  },
  productivity: {
    micro: "1 task",
    standard: "3 tasks",
    stretch: "5 tasks"
  },
  mindfulness: {
    micro: "2 min meditation",
    standard: "10 min meditation",
    stretch: "20 min meditation"
  },
  learning: {
    micro: "Read 1 page",
    standard: "Read 10 pages",
    stretch: "Read 25 pages"
  }
};

/**
 * Day names
 */
export const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

/**
 * Month names
 */
export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

/**
 * Preset filter periods
 */
export const TIME_PERIODS = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year"
};

/**
 * Levels and their corresponding numeric values for charts
 */
export const LEVEL_VALUES = {
  none: 0,
  micro: 1,
  standard: 2,
  stretch: 3
};

/**
 * Charts colors
 */
export const CHART_COLORS = {
  primary: "#4F46E5",
  blue: "#3B82F6",
  purple: "#8B5CF6",
  green: "#10B981",
  amber: "#F59E0B",
  gray: "#6B7280"
};
