import { DataSource } from "typeorm";
import { Note } from "../entities/note.entity";
import { User } from "../entities/user.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "notes.db",
  synchronize: process.env.NODE_ENV === "development",
  logging: process.env.NODE_ENV === "development",
  entities: [Note, User],
  migrations: ["src/migrations/*.ts"],
  subscribers: ["src/subscriber/*.ts"]
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connection established successfully");
    
    // Run migrations in production
    if (process.env.NODE_ENV === "production") {
      await AppDataSource.runMigrations();
      console.log("✅ Database migrations completed");
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
};
