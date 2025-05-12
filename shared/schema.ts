import { pgTable, text, serial, integer, boolean, date, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table (keeping the existing one)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Habit Categories
export const HABIT_CATEGORIES = [
  "health",
  "productivity",
  "mindfulness",
  "learning",
  "other",
] as const;

export const COMMITMENT_LEVELS = ["micro", "standard", "stretch"] as const;
export const FREQUENCY_TYPES = ["daily", "weekly", "custom"] as const;

// Habits table
export const habits = pgTable("habits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  frequency: text("frequency").notNull(),
  color: text("color").notNull(),
  icon: text("icon").notNull(),
  microLevel: text("micro_level").notNull(),
  standardLevel: text("standard_level").notNull(),
  stretchLevel: text("stretch_level").notNull(),
  reminderTime: text("reminder_time"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  active: boolean("active").notNull().default(true),
});

export const insertHabitSchema = createInsertSchema(habits)
  .omit({ id: true, createdAt: true })
  .extend({
    category: z.enum(HABIT_CATEGORIES),
    frequency: z.enum(FREQUENCY_TYPES),
  });

export type InsertHabit = z.infer<typeof insertHabitSchema>;
export type Habit = typeof habits.$inferSelect;

// HabitCompletions table
export const habitCompletions = pgTable("habit_completions", {
  id: serial("id").primaryKey(),
  habitId: integer("habit_id").notNull(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  level: text("level").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertHabitCompletionSchema = createInsertSchema(habitCompletions)
  .omit({ id: true, createdAt: true })
  .extend({
    level: z.enum(COMMITMENT_LEVELS),
    date: z.coerce.date(),
  });

export type InsertHabitCompletion = z.infer<typeof insertHabitCompletionSchema>;
export type HabitCompletion = typeof habitCompletions.$inferSelect;
