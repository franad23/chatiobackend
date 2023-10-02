import { Request, Response } from "express";
import UserModel from "../models/User";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectedUsers } from "../app";

dotenv.config();

//Interfaces 
import { User } from "../interfaces/user";

export const registerUser = async (req: Request, res: Response) => {
  const {username, password}: User = req.body;
  const userFound = await UserModel.findOne({ username });

  if (userFound) return res.status(400).json({ message: "El usuario ya existe"});

  try {
    if (!username || !password) return res.status(400).json({ message: "Faltan datos por rellenar"});
    const passwordEncryp = await bcrypt.hash(password, 10);
    
    const newUser =  new UserModel({
      username, 
      password: passwordEncryp,
    });
    newUser.save();
    res.status(201).json({ message: `Usuario ${username} creado correctamente`});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al crear el usuario"});
  }
}

export const loginUser = async (req: Request, res: Response) => {
  const {username, password}: User = req.body;

  const userFound = await UserModel.findOne({ username });
  if (!userFound) return res.status(400).json({ message: "El usuario no existe"});

  try {
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) return res.status(400).json({ message: "Usuario o contraseña incorrectos"});
    if(connectedUsers.some(user => user.user.id === userFound._id.toString())) return res.status(400).json({ message: "El usuario ya esta conectado"})

    const token = jwt.sign(
      {_id: userFound._id,
      username: userFound.username}, 
      process.env.JWT_SECRET as string,
      {
        expiresIn: 60*60*24
      })
      res.json({
        token,
        profile: {
          id: userFound._id,
          username:userFound.username
        }
      })

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error al hacer login"});
}
}





