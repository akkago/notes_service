import { Service, Context } from "moleculer";
import { AppDataSource } from "../config/database";
import { User } from "../entities/user.entity";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

export default {
  name: "users",
  actions: {
    register: {
      rest: "POST /users/register",
      params: {
        email: { type: "email" },
        username: { type: "string", min: 3, max: 50 },
        password: { type: "string", min: 6 }
      },
      async handler(ctx: Context<any, { email: string; username: string; password: string }>) {
        const userRepository = AppDataSource.getRepository(User);
        
        // Check if user already exists
        const existingUser = await userRepository.findOne({
          where: { email: ctx.params.email }
        });
        
        if (existingUser) {
          throw new Error("User with this email already exists");
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(ctx.params.password, 10);
        
        // Create user
        const user = userRepository.create({
          email: ctx.params.email,
          username: ctx.params.username,
          password: hashedPassword
        });
        
        const savedUser = await userRepository.save(user);
        
        // Generate JWT token
        // @ts-ignore - jsonwebtoken types issue
        const token = jwt.sign(
          { userId: savedUser.id, email: savedUser.email },
          process.env.JWT_SECRET || "default-secret",
          { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );
        
        return {
          user: {
            id: savedUser.id,
            email: savedUser.email,
            username: savedUser.username
          },
          token
        };
      }
    },
    
    login: {
      rest: "POST /users/login",
      params: {
        email: { type: "email" },
        password: { type: "string" }
      },
      async handler(ctx: Context<any, { email: string; password: string }>) {
        const userRepository = AppDataSource.getRepository(User);
        
        // Find user
        const user = await userRepository.findOne({
          where: { email: ctx.params.email }
        });
        
        if (!user) {
          throw new Error("Invalid credentials");
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(ctx.params.password, user.password);
        
        if (!isValidPassword) {
          throw new Error("Invalid credentials");
        }
        
        // Generate JWT token
        // @ts-ignore - jsonwebtoken types issue
        const token = jwt.sign(
          { userId: user.id, email: user.email },
          process.env.JWT_SECRET || "default-secret",
          { expiresIn: process.env.JWT_EXPIRES_IN || "24h" }
        );

        return {
          user: {
            id: user.id,
            email: user.email,
            username: user.username
          },
          token
        };
      }
    },
    
    profile: {
      rest: "GET /users/profile",
      auth: "required",
      async handler(ctx: Context<any, any>) {
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({
          where: { id: ctx.meta.user.userId }
        });
        
        if (!user) {
          throw new Error("User not found");
        }
        
        return {
          id: user.id,
          email: user.email,
          username: user.username,
          createdAt: user.createdAt
        };
      }
    }
  }
};
