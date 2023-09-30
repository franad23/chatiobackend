import { Router } from "express";

//Controllers
import { getContacts } from "../controllers/usercontacts.controller";

const router = Router();

router.get("/contacts", getContacts);

export default router;