import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertHabitSchema, insertHabitCompletionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    return res.json({ 
      id: user.id,
      username: user.username
    });
  });

  // Habits routes
  app.get("/api/habits", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    const habits = await storage.getHabits(userId);
    return res.json(habits);
  });

  app.get("/api/habits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    const habit = await storage.getHabit(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    return res.json(habit);
  });

  app.post("/api/habits", async (req, res) => {
    try {
      const habitData = insertHabitSchema.parse(req.body);
      const habit = await storage.createHabit(habitData);
      return res.status(201).json(habit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid habit data", errors: error.errors });
      }
      return res.status(500).json({ message: "Error creating habit" });
    }
  });

  app.patch("/api/habits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    try {
      const updateData = insertHabitSchema.partial().parse(req.body);
      const updatedHabit = await storage.updateHabit(id, updateData);
      
      if (!updatedHabit) {
        return res.status(404).json({ message: "Habit not found" });
      }
      
      return res.json(updatedHabit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid habit data", errors: error.errors });
      }
      return res.status(500).json({ message: "Error updating habit" });
    }
  });

  app.delete("/api/habits/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    const success = await storage.deleteHabit(id);
    if (!success) {
      return res.status(404).json({ message: "Habit not found" });
    }

    return res.json({ success: true });
  });

  // Habit completion routes
  app.get("/api/habit-completions", async (req, res) => {
    const userId = parseInt(req.query.userId as string);
    const date = req.query.date as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid userId is required" });
    }

    // Get completions for a specific date
    if (date) {
      try {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          throw new Error("Invalid date");
        }
        
        const completions = await storage.getHabitCompletionsByDate(userId, parsedDate);
        return res.json(completions);
      } catch (error) {
        return res.status(400).json({ message: "Invalid date format" });
      }
    }
    
    // Get completions for a date range
    if (startDate && endDate) {
      try {
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        
        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
          throw new Error("Invalid date range");
        }
        
        const completions = await storage.getHabitCompletionsByDateRange(
          userId, 
          parsedStartDate, 
          parsedEndDate
        );
        return res.json(completions);
      } catch (error) {
        return res.status(400).json({ message: "Invalid date range format" });
      }
    }
    
    return res.status(400).json({ message: "Date or date range is required" });
  });

  app.post("/api/habit-completions", async (req, res) => {
    try {
      const completionData = insertHabitCompletionSchema.parse(req.body);
      const completion = await storage.createHabitCompletion(completionData);
      return res.status(201).json(completion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid completion data", errors: error.errors });
      }
      return res.status(500).json({ message: "Error creating habit completion" });
    }
  });

  app.delete("/api/habit-completions/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Valid completion id is required" });
    }

    const success = await storage.deleteHabitCompletion(id);
    if (!success) {
      return res.status(404).json({ message: "Habit completion not found" });
    }

    return res.json({ success: true });
  });

  // Analytics routes
  app.get("/api/analytics/current-streak/:habitId", async (req, res) => {
    const habitId = parseInt(req.params.habitId);
    if (isNaN(habitId)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    const streak = await storage.getCurrentStreak(habitId);
    return res.json({ streak });
  });

  app.get("/api/analytics/completion-rate/:habitId", async (req, res) => {
    const habitId = parseInt(req.params.habitId);
    if (isNaN(habitId)) {
      return res.status(400).json({ message: "Valid habit id is required" });
    }

    const rate = await storage.getCompletionRate(habitId);
    return res.json({ rate });
  });

  app.get("/api/analytics/best-day/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid user id is required" });
    }

    const bestDay = await storage.getBestDay(userId);
    return res.json({ bestDay });
  });

  app.get("/api/analytics/summary/:userId", async (req, res) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Valid user id is required" });
    }

    const habits = await storage.getHabits(userId);
    if (habits.length === 0) {
      return res.json({
        currentStreak: 0,
        completionRate: 0,
        bestDay: null,
        totalHabits: 0
      });
    }

    const bestDay = await storage.getBestDay(userId);
    
    // Get the max streak and average completion rate
    let totalStreak = 0;
    let totalRate = 0;
    for (const habit of habits) {
      const streak = await storage.getCurrentStreak(habit.id);
      const rate = await storage.getCompletionRate(habit.id);
      
      totalStreak = Math.max(totalStreak, streak);
      totalRate += rate;
    }
    
    const avgCompletionRate = habits.length > 0 ? Math.round(totalRate / habits.length) : 0;
    
    return res.json({
      currentStreak: totalStreak,
      completionRate: avgCompletionRate,
      bestDay,
      totalHabits: habits.length
    });
  });

  return httpServer;
}
