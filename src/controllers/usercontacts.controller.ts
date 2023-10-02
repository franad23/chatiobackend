import { Request, Response } from "express";
import UserModel from "../models/User";

//Interfaces
import { UserContact } from "../interfaces/UserContact";

export const getContacts = async (req: Request, res: Response) => {
  const userlogged = req.username;
  const { username } = req.query;
  if (username?.length == 0) return;
  try {
    const users = await UserModel.find(
      { username: { $regex: `^${username}`, $options: "i" } },
      "username _id"
    );
    if (users.length == 0)
      return res
        .status(404)
        .json({ message: "No se encontraron coincidencias" });

    res.status(200).json(users.filter((user) => user._id != userlogged._id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const addContact = async (req: Request, res: Response) => {
  const userLogged = req.username;
  const { _id, username } = req.body;

  const userLoggedFound = await UserModel.findById(userLogged._id);
  if(userLoggedFound.contacts.some(contact => contact._id == _id)) return res.status(400).json({message: "Contacto ya agregado"})

  try {
    const updatedUserLogged = await UserModel.findByIdAndUpdate(
      userLogged._id,
      {
        $push: {
          contacts: {
            _id: _id,
            username: username,
            isAccepted: true,
          },
        },
      },
      { new: true } 
    );
    const updatedUserToAdd = await UserModel.findByIdAndUpdate(
      _id,
      {
        $push: {
          contacts: {
            _id: userLogged._id,
            username: userLogged.username,
            isAccepted: false,
          },
        },
      },
      { new: true } 
    );

    res.json({
      message: "Contacto agregado exitosamente",
      // updatedUserLogged,
      // updatedUserToAdd,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};


