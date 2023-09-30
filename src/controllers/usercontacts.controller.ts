import { Request, Response } from "express";
import UserModel from "../models/User";

export const getContacts = async (req: Request, res: Response) => {
  const { username } = req.query;
  if(username?.length == 0) return
  try {
    const users = await UserModel.find(
      { username: { $regex: `^${username}`, $options: "i" } },
      "username _id"
    );
    if (users.length == 0)
      return res
        .status(404)
        .json({ message: "No se encontraron coincidencias" });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// export const addContact = (req: Request, res: Response) => {

// }
