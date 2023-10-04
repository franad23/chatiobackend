import { Router } from "express";

//Controllers
import { getContacts, addContact, getContactsToAccept } from "../controllers/usercontacts.controller";

//Middlewares
import { authToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/contacts", authToken, getContacts);
router.patch("/contacts", authToken, addContact);
router.get("/contacts/to-accept", authToken, getContactsToAccept)



export default router;