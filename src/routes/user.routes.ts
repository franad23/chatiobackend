import { Router } from "express";

//Controllers
import { getContacts, addContact, getContactsToAccept, contactAccepted } from "../controllers/usercontacts.controller";

//Middlewares
import { authToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/contacts", authToken, getContacts);
router.patch("/contacts", authToken, addContact);
router.get("/contacts/to-accept", authToken, getContactsToAccept);
router.patch("/contacts/to-accept", authToken, contactAccepted);



export default router;