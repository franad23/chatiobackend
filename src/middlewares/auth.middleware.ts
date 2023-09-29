import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const authToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if(!authHeader) return res.status(401).json({ message: "Token no proporcionado"})
  
  const token = authHeader.split(" ")[1];
  
  if(!token) return res.status(401).json({ message: "Token no proporcionado"})

  jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
    if(err) return res.status(401).json({ message: "Token no válido"})
    req.body.user = decoded;
    next();
  })
  
}

