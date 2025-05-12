import {
  users,
  habits,
  habitCompletions,
  type User,
  type InsertUser,
  type Habit,
  type InsertHabit,
  type HabitCompletion,
  type InsertHabitCompletion,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Habit methods
  getHabits(userId: number): Promise<Habit[]>;
  getHabit(id: number): Promise<Habit | undefined>;
  createHabit(habit: InsertHabit): Promise<Habit>;
  updateHabit(id: number, habit: Partial<InsertHabit>): Promise<Habit | undefined>;
  deleteHabit(id: number): Promise<boolean>;

  // Habit completion methods
  getHabitCompletions(habitId: number): Promise<HabitCompletion[]>;
  getHabitCompletionsByDate(userId: number, date: Date): Promise<HabitCompletion[]>;
  getHabitCompletionsByDateRange(
    userId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<HabitCompletion[]>;
  createHabitCompletion(completion: InsertHabitCompletion): Promise<HabitCompletion>;
  deleteHabitCompletion(id: number): Promise<boolean>;
  
  // Analytics methods
  getCurrentStreak(habitId: number): Promise<number>;
  getCompletionRate(habitId: number): Promise<number>;
  getBestDay(userId: number): Promise<string | null>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private habits: Map<number, Habit>;
  private habitCompletions: Map<number, HabitCompletion>;
  private userIdCounter: number;
  private habitIdCounter: number;
  private completionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.habits = new Map();
    this.habitCompletions = new Map();
    this.userIdCounter = 1;
    this.habitIdCounter = 1;
    this.completionIdCounter = 1;
    
    // Add demo user if it doesn't exist
    this.createUser({ username: 'demo', password: 'demo123' })
      .then(user => {
        // Create some initial habits for demo purposes
        const defaultHabits = [
          {
            userId: user.id,
            title: 'Exercise',
            category: 'health',
            frequency: 'daily',
            color: '#4F46E5',
            icon: 'running',
            microLevel: '5 min walk',
            standardLevel: '15 min workout',
            stretchLevel: '30 min intense',
            reminderTime: '07:00',
            active: true
          },
          {
            userId: user.id,
            title: 'Reading',
            category: 'learning',
            frequency: 'daily',
            color: '#3B82F6',
            icon: 'book',
            microLevel: '5 min',
            standardLevel: '15 min',
            stretchLevel: '30 min',
            reminderTime: '21:00',
            active: true
          },
          {
            userId: user.id,
            title: 'Meditation',
            category: 'mindfulness',
            frequency: 'daily',
            color: '#8B5CF6',
            icon: 'brain',
            microLevel: '2 min',
            standardLevel: '10 min',
            stretchLevel: '20 min',
            reminderTime: '08:00',
            active: true
          }
        ];
        
        defaultHabits.forEach(habit => this.createHabit(habit as InsertHabit));
        
        // Create some habit completions for the demo user
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        // Exercise completions
        this.getHabits(user.id).then(habits => {
          if (habits.length > 0) {
            // Create completions for the last 10 days
            for (let i = 0; i < 10; i++) {
              const date = new Date();
              date.setDate(date.getDate() - i);
              
              // Exercise - micro level for some days
              if (i % 3 !== 0) {
                this.createHabitCompletion({
                  habitId: habits[0].id,
                  userId: user.id,
                  date: date,
                  level: i % 5 === 0 ? 'stretch' : i % 2 === 0 ? 'standard' : 'micro'
                });
              }
              
              // Reading - standard level for most days
              if (i % 4 !== 0) {
                this.createHabitCompletion({
                  habitId: habits[1].id,
                  userId: user.id,
                  date: date,
                  level: i % 7 === 0 ? 'stretch' : i % 3 === 0 ? 'micro' : 'standard'
                });
              }
              
              // Meditation - less consistent
              if (i % 2 === 0 && i < 6) {
                this.createHabitCompletion({
                  habitId: habits[2].id,
                  userId: user.id,
                  date: date,
                  level: i % 4 === 0 ? 'standard' : 'micro'
                });
              }
            }
          }
        });
      });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const existingUser = await this.getUserByUsername(insertUser.username);
    if (existingUser) {
      return existingUser;
    }
    
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Habit methods
  async getHabits(userId: number): Promise<Habit[]> {
    return Array.from(this.habits.values()).filter(
      (habit) => habit.userId === userId && habit.active
    );
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    return this.habits.get(id);
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const id = this.habitIdCounter++;
    const createdAt = new Date();
    const habit: Habit = { ...insertHabit, id, createdAt };
    this.habits.set(id, habit);
    return habit;
  }

  async updateHabit(id: number, updateData: Partial<InsertHabit>): Promise<Habit | undefined> {
    const habit = this.habits.get(id);
    if (!habit) return undefined;

    const updatedHabit = { ...habit, ...updateData };
    this.habits.set(id, updatedHabit);
    return updatedHabit;
  }

  async deleteHabit(id: number): Promise<boolean> {
    const habit = this.habits.get(id);
    if (!habit) return false;

    // Soft delete by marking as inactive
    const updatedHabit = { ...habit, active: false };
    this.habits.set(id, updatedHabit);
    return true;
  }

  // Habit completion methods
  async getHabitCompletions(habitId: number): Promise<HabitCompletion[]> {
    return Array.from(this.habitCompletions.values()).filter(
      (completion) => completion.habitId === habitId
    );
  }

  async getHabitCompletionsByDate(userId: number, date: Date): Promise<HabitCompletion[]> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.habitCompletions.values()).filter(completion => {
      const completionDate = new Date(completion.date);
      completionDate.setHours(0, 0, 0, 0);
      return completion.userId === userId && 
             completionDate.getTime() === targetDate.getTime();
    });
  }

  async getHabitCompletionsByDateRange(
    userId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<HabitCompletion[]> {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    
    return Array.from(this.habitCompletions.values()).filter(completion => {
      const completionDate = new Date(completion.date);
      return completion.userId === userId && 
             completionDate >= start && 
             completionDate <= end;
    });
  }

  async createHabitCompletion(insertCompletion: InsertHabitCompletion): Promise<HabitCompletion> {
    // Check if completion already exists for the same habit, date, and user
    const existingCompletion = Array.from(this.habitCompletions.values()).find(
      c => c.habitId === insertCompletion.habitId && 
           c.userId === insertCompletion.userId && 
           new Date(c.date).toDateString() === new Date(insertCompletion.date).toDateString()
    );
    
    if (existingCompletion) {
      // Update the existing completion with the new level
      const updatedCompletion = { 
        ...existingCompletion, 
        level: insertCompletion.level,
        createdAt: new Date() 
      };
      this.habitCompletions.set(existingCompletion.id, updatedCompletion);
      return updatedCompletion;
    }
    
    // Create new completion
    const id = this.completionIdCounter++;
    const createdAt = new Date();
    const completion: HabitCompletion = { 
      ...insertCompletion, 
      id, 
      createdAt 
    };
    this.habitCompletions.set(id, completion);
    return completion;
  }

  async deleteHabitCompletion(id: number): Promise<boolean> {
    return this.habitCompletions.delete(id);
  }

  // Analytics methods
  async getCurrentStreak(habitId: number): Promise<number> {
    const habit = await this.getHabit(habitId);
    if (!habit) return 0;

    const completions = await this.getHabitCompletions(habitId);
    if (completions.length === 0) return 0;

    // Sort completions by date (most recent first)
    const sortedCompletions = completions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if there's a completion for today
    const todayCompletion = sortedCompletions.find(c => 
      new Date(c.date).toDateString() === currentDate.toDateString()
    );
    
    // If no completion for today, check yesterday
    if (!todayCompletion) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayCompletion = sortedCompletions.find(c => 
        new Date(c.date).toDateString() === yesterday.toDateString()
      );
      
      // If no completion for yesterday either, streak is 0
      if (!yesterdayCompletion) return 0;
      
      // Start counting from yesterday
      currentDate = yesterday;
    }
    
    // Count consecutive days
    for (let i = 0; i < 365; i++) { // Cap at 365 days
      const dateToCheck = new Date(currentDate);
      dateToCheck.setDate(dateToCheck.getDate() - i);
      
      const hasCompletion = sortedCompletions.some(c => 
        new Date(c.date).toDateString() === dateToCheck.toDateString()
      );
      
      if (hasCompletion) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  async getCompletionRate(habitId: number): Promise<number> {
    const habit = await this.getHabit(habitId);
    if (!habit) return 0;

    const completions = await this.getHabitCompletions(habitId);
    if (completions.length === 0) return 0;

    // Calculate days since habit creation
    const creationDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    // Count unique dates with completions
    const uniqueDates = new Set(completions.map(c => new Date(c.date).toDateString()));
    const daysCompleted = uniqueDates.size;
    
    return Math.round((daysCompleted / daysSinceCreation) * 100);
  }

  async getBestDay(userId: number): Promise<string | null> {
    const habits = await this.getHabits(userId);
    if (habits.length === 0) return null;

    const completions = Array.from(this.habitCompletions.values())
      .filter(c => c.userId === userId);
    
    if (completions.length === 0) return null;

    // Group completions by day of week
    const dayCompletions: { [key: string]: number } = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0
    };
    
    // Count completions for each day
    completions.forEach(completion => {
      const date = new Date(completion.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayCompletions[day]++;
    });
    
    // Find the day with the most completions
    const bestDay = Object.keys(dayCompletions).reduce((a, b) => 
      dayCompletions[a] > dayCompletions[b] ? a : b
    );
    
    return bestDay;
  }
}

// Database implementation

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const existingUser = await this.getUserByUsername(insertUser.username);
    if (existingUser) {
      return existingUser;
    }
    
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getHabits(userId: number): Promise<Habit[]> {
    return db
      .select()
      .from(habits)
      .where(and(eq(habits.userId, userId), eq(habits.active, true)));
  }

  async getHabit(id: number): Promise<Habit | undefined> {
    const [habit] = await db
      .select()
      .from(habits)
      .where(eq(habits.id, id));
    return habit || undefined;
  }

  async createHabit(insertHabit: InsertHabit): Promise<Habit> {
    const [habit] = await db
      .insert(habits)
      .values({ ...insertHabit, reminderTime: insertHabit.reminderTime || null })
      .returning();
    return habit;
  }

  async updateHabit(id: number, updateData: Partial<InsertHabit>): Promise<Habit | undefined> {
    const [updatedHabit] = await db
      .update(habits)
      .set(updateData)
      .where(eq(habits.id, id))
      .returning();
    
    return updatedHabit || undefined;
  }

  async deleteHabit(id: number): Promise<boolean> {
    // Soft delete by marking as inactive
    const [updatedHabit] = await db
      .update(habits)
      .set({ active: false })
      .where(eq(habits.id, id))
      .returning();
    
    return !!updatedHabit;
  }

  async getHabitCompletions(habitId: number): Promise<HabitCompletion[]> {
    return db
      .select()
      .from(habitCompletions)
      .where(eq(habitCompletions.habitId, habitId));
  }

  async getHabitCompletionsByDate(userId: number, date: Date): Promise<HabitCompletion[]> {
    const dateStr = date.toISOString().split('T')[0];
    
    return db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.userId, userId),
          eq(habitCompletions.date, dateStr)
        )
      );
  }

  async getHabitCompletionsByDateRange(
    userId: number, 
    startDate: Date, 
    endDate: Date
  ): Promise<HabitCompletion[]> {
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    
    return db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.userId, userId),
          gte(habitCompletions.date, startDateStr),
          lte(habitCompletions.date, endDateStr)
        )
      );
  }

  async createHabitCompletion(insertCompletion: InsertHabitCompletion): Promise<HabitCompletion> {
    // Format date as string for storage
    const dateStr = new Date(insertCompletion.date).toISOString().split('T')[0];
    
    // Check if a completion already exists for the same date, habit, and user
    const existingCompletions = await db
      .select()
      .from(habitCompletions)
      .where(
        and(
          eq(habitCompletions.habitId, insertCompletion.habitId),
          eq(habitCompletions.userId, insertCompletion.userId),
          eq(habitCompletions.date, dateStr)
        )
      );
    
    if (existingCompletions.length > 0) {
      // Update existing completion
      const [updatedCompletion] = await db
        .update(habitCompletions)
        .set({ level: insertCompletion.level })
        .where(eq(habitCompletions.id, existingCompletions[0].id))
        .returning();
      
      return updatedCompletion;
    }
    
    // Create new completion
    const [completion] = await db
      .insert(habitCompletions)
      .values({ ...insertCompletion, date: dateStr })
      .returning();
    
    return completion;
  }

  async deleteHabitCompletion(id: number): Promise<boolean> {
    const result = await db
      .delete(habitCompletions)
      .where(eq(habitCompletions.id, id))
      .returning();
    
    return result.length > 0;
  }

  async getCurrentStreak(habitId: number): Promise<number> {
    const habit = await this.getHabit(habitId);
    if (!habit) return 0;

    const completions = await this.getHabitCompletions(habitId);
    if (completions.length === 0) return 0;

    // Sort completions by date (most recent first)
    const sortedCompletions = [...completions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    // Check if there's a completion for today
    const todayCompletion = sortedCompletions.find(c => 
      new Date(c.date).toDateString() === currentDate.toDateString()
    );
    
    // If no completion for today, check yesterday
    if (!todayCompletion) {
      const yesterday = new Date(currentDate);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayCompletion = sortedCompletions.find(c => 
        new Date(c.date).toDateString() === yesterday.toDateString()
      );
      
      // If no completion for yesterday either, streak is 0
      if (!yesterdayCompletion) return 0;
      
      // Start counting from yesterday
      currentDate = yesterday;
    }
    
    // Count consecutive days
    for (let i = 0; i < 365; i++) { // Cap at 365 days
      const dateToCheck = new Date(currentDate);
      dateToCheck.setDate(dateToCheck.getDate() - i);
      
      const hasCompletion = sortedCompletions.some(c => 
        new Date(c.date).toDateString() === dateToCheck.toDateString()
      );
      
      if (hasCompletion) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  async getCompletionRate(habitId: number): Promise<number> {
    const habit = await this.getHabit(habitId);
    if (!habit) return 0;

    const completions = await this.getHabitCompletions(habitId);
    if (completions.length === 0) return 0;

    // Calculate days since habit creation
    const creationDate = new Date(habit.createdAt);
    const today = new Date();
    const daysSinceCreation = Math.floor((today.getTime() - creationDate.getTime()) / (1000 * 3600 * 24)) + 1;
    
    // Count unique dates with completions
    const uniqueDates = new Set(completions.map(c => new Date(c.date).toDateString()));
    const daysCompleted = uniqueDates.size;
    
    return Math.round((daysCompleted / daysSinceCreation) * 100);
  }

  async getBestDay(userId: number): Promise<string | null> {
    const habits = await this.getHabits(userId);
    if (habits.length === 0) return null;

    // Get all completions for user
    const completions = await db
      .select()
      .from(habitCompletions)
      .where(eq(habitCompletions.userId, userId));
    
    if (completions.length === 0) return null;

    // Group completions by day of week
    const dayCompletions: { [key: string]: number } = {
      'Sunday': 0,
      'Monday': 0,
      'Tuesday': 0,
      'Wednesday': 0,
      'Thursday': 0,
      'Friday': 0,
      'Saturday': 0
    };
    
    // Count completions for each day
    completions.forEach(completion => {
      const date = new Date(completion.date);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      dayCompletions[day]++;
    });
    
    // Find the day with the most completions
    const bestDay = Object.keys(dayCompletions).reduce((a, b) => 
      dayCompletions[a] > dayCompletions[b] ? a : b
    );
    
    return bestDay;
  }
}

// Create a demo user and habits for testing
async function createDemoData() {
  const storage = new DatabaseStorage();
  
  try {
    // Create demo user if it doesn't exist
    const demoUser = await storage.createUser({ username: 'demo', password: 'demo123' });
    
    // Check if demo user already has habits
    const existingHabits = await storage.getHabits(demoUser.id);
    
    if (existingHabits.length === 0) {
      // Create some initial habits for demo purposes
      const defaultHabits = [
        {
          userId: demoUser.id,
          title: 'Exercise',
          category: 'health',
          frequency: 'daily',
          color: '#4F46E5',
          icon: 'running',
          microLevel: '5 min walk',
          standardLevel: '15 min workout',
          stretchLevel: '30 min intense',
          reminderTime: '07:00',
          active: true
        },
        {
          userId: demoUser.id,
          title: 'Reading',
          category: 'learning',
          frequency: 'daily',
          color: '#3B82F6',
          icon: 'book',
          microLevel: '5 min',
          standardLevel: '15 min',
          stretchLevel: '30 min',
          reminderTime: '21:00',
          active: true
        },
        {
          userId: demoUser.id,
          title: 'Meditation',
          category: 'mindfulness',
          frequency: 'daily',
          color: '#8B5CF6',
          icon: 'brain',
          microLevel: '2 min',
          standardLevel: '10 min',
          stretchLevel: '20 min',
          reminderTime: '08:00',
          active: true
        }
      ];
      
      const createdHabits = [];
      for (const habit of defaultHabits) {
        createdHabits.push(await storage.createHabit(habit as InsertHabit));
      }
      
      // Create some habit completions for the demo user
      const today = new Date();
      
      // Create completions for the last 10 days
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        
        // Exercise - micro level for some days
        if (i % 3 !== 0 && createdHabits[0]) {
          await storage.createHabitCompletion({
            habitId: createdHabits[0].id,
            userId: demoUser.id,
            date: dateStr,
            level: i % 5 === 0 ? 'stretch' : i % 2 === 0 ? 'standard' : 'micro'
          });
        }
        
        // Reading - standard level for most days
        if (i % 4 !== 0 && createdHabits[1]) {
          await storage.createHabitCompletion({
            habitId: createdHabits[1].id,
            userId: demoUser.id,
            date: dateStr,
            level: i % 7 === 0 ? 'stretch' : i % 3 === 0 ? 'micro' : 'standard'
          });
        }
        
        // Meditation - less consistent
        if (i % 2 === 0 && i < 6 && createdHabits[2]) {
          await storage.createHabitCompletion({
            habitId: createdHabits[2].id,
            userId: demoUser.id,
            date: dateStr,
            level: i % 4 === 0 ? 'standard' : 'micro'
          });
        }
      }
    }
  } catch (error) {
    console.error('Error creating demo data:', error);
  }
}

// Initialize the storage
export const storage = new DatabaseStorage();

// Create demo data when the server starts
createDemoData().catch(console.error);
