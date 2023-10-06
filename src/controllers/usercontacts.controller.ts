import { Request, Response } from "express";
import UserModel from "../models/User";
import ContactsNotAcceptedModel from "../models/ContactsNotAccepted";

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
  if(userLoggedFound?.contacts.some(contact => contact._id == _id)) return res.status(400).json({message: "Contacto ya agregado"})

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

export const getContactsToAccept = async (req: Request, res: Response) => {
  const userLogged = req.username;
  try {
    const userContacts = await UserModel.findById(userLogged._id);
    const contactsNotAccepted = userContacts?.contacts.filter(contact => contact.isAccepted == false);
    // const contactsNotAccepted 
    if (contactsNotAccepted?.length == 0) {
      res.status(404).json({ message: "No tienes conectatos para aceptar" });
      return; 
    }
    res.status(200).json(contactsNotAccepted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}

export const contactAccepted = async (req: Request, res: Response) => {
  const userLogged = req.username;
  const { _id, username, isAccepted } = req.body;
  
  try {
    if (!isAccepted) {
      await UserModel.findByIdAndUpdate(
        userLogged._id,
        {
          $pull: {
            contacts: { _id: _id },
          },
        }
      );

      const userContactsNotAccepted = await ContactsNotAcceptedModel.findByIdAndUpdate(
        userLogged._id,
        {
          $push: {
            contactsNotAccepted: {
              _id: _id,
            },
          },
        }
      );

      if (!userContactsNotAccepted) {
        const newUser = new ContactsNotAcceptedModel({
          _id: userLogged._id,
          contactsNotAccepted: [{ _id: _id }],
        });

        await newUser.save();
      }
      
      res.json({ message: "Contacto no aceptado" });
    } else {
      await UserModel.findOneAndUpdate(
        {
          _id: userLogged._id,
          'contacts._id': _id,
        },
        {
          $set: {
            'contacts.$.isAccepted': true,
          },
        },
        { new: true }
      );

      res.status(200).json({ message: "Contacto aceptado exitosamente" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

export const getUserContactsAccepted = async (req: Request, res: Response) => {
  const userLogged = req.username;
  try {
    const userFound = await UserModel.findById(userLogged._id);
    if (!userFound) return res.status(404).json({ message: "Usuario no encontrado"});
    res.status(200).json(userFound.contacts.filter(contact => contact.isAccepted == true));
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
}
