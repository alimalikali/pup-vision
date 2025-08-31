import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { JWTPayload } from "@/types/auth"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-refresh-secret-key"
const ACCESS_TOKEN_EXPIRES_IN = "15m" // 15 minutes
const REFRESH_TOKEN_EXPIRES_IN = "7d" // 7 days

// ==================== PASSWORD UTILITIES ====================
export const passwordUtils = {
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return bcrypt.hash(password, saltRounds)
  },

  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword)
  },
}

// ==================== JWT UTILITIES ====================
export const jwtUtils = {
  generateAccessToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRES_IN })
  },

  generateRefreshToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })
  },

  verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  },

  verifyRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload
    } catch (error) {
      return null
    }
  },

  decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload
    } catch (error) {
      return null
    }
  },

  // Legacy method for backward compatibility
  generateToken(payload: { userId: string; email: string }): string {
    return this.generateAccessToken(payload)
  },

  verifyToken(token: string): JWTPayload | null {
    return this.verifyAccessToken(token)
  },
}


