import { Router } from "express";

//Controllers
import { 
  getContacts, 
  addContact, 
  getContactsToAccept, 
  contactAccepted,
  getUserContactsAccepted } from "../controllers/usercontacts.controller";

//Middlewares
import { authToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/contacts", authToken, getContacts);
router.get("/contacts/accepted", authToken, getUserContactsAccepted);
router.patch("/contacts", authToken, addContact);
router.get("/contacts/to-accept", authToken, getContactsToAccept);
router.patch("/contacts/to-accept", authToken, contactAccepted);



export default router;