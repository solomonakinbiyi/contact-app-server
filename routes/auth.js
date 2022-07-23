import express from "express";
import {
  signup,
  signin,
  currentUser,
  createContact,
  getAllUserContacts,
  updateUserContact,
  deleteUserContact,
  home,
} from "../controllers/auth";

const router = express.Router();

// middleware
import { requireSignin } from "../middlewares";

// routes
router.get("/", home);

router.post("/signup", signup);
router.post("/signin", signin);
router.get("/current-user", requireSignin, currentUser);
router.post("/create-contact", requireSignin, createContact);
router.get("/get-all-contacts/:owneremail", requireSignin, getAllUserContacts);
router.put("/update-contact/:owneremail", requireSignin, updateUserContact);
router.delete(
  "/delete-contact/:owneremail/:id",
  requireSignin,
  deleteUserContact
);

module.exports = router;
