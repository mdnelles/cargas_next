import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

interface JWTPayload {
   userId: number;
   email: string;
   iat?: number;
   exp?: number;
}

export function verifyToken(token: string): JWTPayload | null {
   try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
   } catch (error) {
      return null;
   }
}

export function createToken(payload: Omit<JWTPayload, "iat" | "exp">) {
   return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}
