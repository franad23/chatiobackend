import { Router } from "express";

//Controllers
import { getContacts, addContact } from "../controllers/usercontacts.controller";

//Middlewares
import { authToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/contacts", authToken, getContacts);
router.patch("/contacts", authToken, addContact);


export default router;