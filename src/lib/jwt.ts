import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Define a custom payload type
interface CustomJwtPayload extends jwt.JwtPayload {
   userId: number;
   email: string;
   name: string;
   country: string;
}

export function createToken(
   payload: Omit<CustomJwtPayload, "iat" | "exp">
): string {
   return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): CustomJwtPayload {
   return jwt.verify(token, JWT_SECRET) as CustomJwtPayload;
}
