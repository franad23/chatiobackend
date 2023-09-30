import { Request, Response } from "express";
import UserModel from "../models/User";

export const getContacts = async (req: Request, res: Response) => {
  const { username } = req.query

  try {
    const users = await UserModel.find(
      { username: { $regex: `^${username}`, $options: 'i' } },
      'username _id'
    );
    
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

// export const addContact = (req: Request, res: Response) => {
  
// }