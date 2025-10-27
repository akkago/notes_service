import { Service, ServiceSchema } from "moleculer";
import { initializeDatabase } from "../config/database";

export default {
  name: "database",
  async started(this: ServiceSchema) {
    try {
      await initializeDatabase();
      if (this.logger) {
        this.logger.info("✅ Database service started successfully");
      }
    } catch (error) {
      if (this.logger) {
        this.logger.error("❌ Failed to start database service:", error);
        // Don't throw error to prevent service from failing
        this.logger.warn("⚠️ Continuing without database initialization");
      }
    }
  },

  async stopped(this: ServiceSchema) {
    if (this.logger) {
      this.logger.info("Database service stopped");
    }
  }
};
