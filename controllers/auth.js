import { hashPassword, comparePassword } from "../helpers/auth";
import jwt from "jsonwebtoken";
const pool = require("../db");

export const home = async (req, res) => {
  return res.json("Welcome to the app!");
};

export const signup = async (req, res) => {
  // return res.json("Signup endpoint");
  const { name, email, password } = req.body;
  // validation
  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }
  if (!email) {
    return res.json({
      error: "Email is required",
    });
  }
  const emailExists = await pool.query(
    "SELECT email FROM users WHERE email = $1",
    [email]
  );
  if (emailExists.rows.length === 1) {
    return res.json({
      error: "Email is already taken",
    });
  }
  if (!password || password.length < 6) {
    return res.json({
      error: "Password is required and should be 6 characters long",
    });
  }
  if (password.length > 64) {
    return res.json({
      error: "Password should not be more than 64 characters long",
    });
  }
  // hash password
  const hashedPassword = await hashPassword(password);
  // save user
  try {
    const newUser = await pool.query(
      "INSERT INTO users (email, name, password) VALUES($1,$2,$3) RETURNING *",
      [email, name, hashedPassword]
    );
    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Signup failed => ", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.json({
      error: "Email is required",
    });
  }
  if (!password) {
    return res.json({
      error: "Password is required",
    });
  }

  try {
    // check if db has user with email
    const userCredentials = await pool.query(
      "SELECT password, email FROM users WHERE email = $1",
      [email]
    );
    if (userCredentials.rows.length === 0) {
      return res.json({
        error: "Email not found",
      });
    }

    // check password
    const match = await comparePassword(
      password,
      userCredentials.rows[0].password
    );
    if (!match) {
      return res.json({
        error: "Wrong password",
      });
    }

    // create signed token
    const token = jwt.sign(
      { email: userCredentials.rows[0].email },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    const user = userCredentials.rows[0].email;

    res.json({
      token,
      user,
    });
  } catch (error) {
    console.log("Login failed => ", error);
    return res.status(400).send("Error. Try again.");
  }
};

export const currentUser = async (req, res) => {
  // console.log(req.auth);
  const { email } = req.auth;
  if (!email) {
    return res.json("Owner's email is required");
  }

  try {
    const userCredentials = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );

    // res.json(userCredentials);
    res.json({ ok: true });
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const createContact = async (req, res) => {
  const { name, email, phone, houseaddress, owneremail } = req.body;

  // validation
  if (!name) {
    return res.json({
      error: "Name is required",
    });
  }

  if (!email) {
    return res.json({
      error: "Email is required",
    });
  }
  const emailExists = await pool.query(
    "SELECT email FROM contacts WHERE email = $1 AND owneremail = $2",
    [email, owneremail]
  );
  if (emailExists.rows.length === 1) {
    return res.json({
      error: "Email is already taken",
    });
  }

  if (!phone) {
    return res.json({
      error: "Phone is required",
    });
  }

  if (!houseaddress) {
    return res.json({
      error: "House address is required",
    });
  }

  if (!owneremail) {
    return res.json({
      error: "Owner's email is required",
    });
  }

  // check if db has user with email
  const userCredentials = await pool.query(
    "SELECT email FROM users WHERE email = $1",
    [owneremail]
  );
  if (userCredentials.rows.length === 0) {
    return res.json("User with email does not exist");
  }

  // save user
  try {
    const newUser = await pool.query(
      "INSERT INTO contacts (email, name, phone, houseaddress, owneremail) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [email, name, phone, houseaddress, owneremail]
    );

    return res.json({
      ok: true,
    });
  } catch (err) {
    console.log("Contact creation failed => ", err);
    return res.status(400).send("Error. Try again.");
  }
};

export const getAllUserContacts = async (req, res) => {
  const { owneremail } = req.params;
  if (!owneremail) {
    return res.json({
      error: "Owner's email is required",
    });
  }

  try {
    const userContacts = await pool.query(
      "SELECT * FROM contacts WHERE owneremail = $1",
      [owneremail]
    );

    res.json(userContacts.rows);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const updateUserContact = async (req, res) => {
  const { name, email, phone, houseaddress, owneremail, id } = req.body;

  if (!id || !owneremail) {
    return res.json("Contact's id and owner's email is required for update!");
  }

  if (!id && !name && !phone && !houseaddress) {
    return res.json("No field to update");
  }

  try {
    if (name) {
      const updateUserContact = await pool.query(
        "UPDATE contacts SET name = $1 WHERE owneremail = $2 AND id = $3",
        [name, owneremail, id]
      );
    }

    if (email) {
      const updateUserContact = await pool.query(
        "UPDATE contacts SET email = $1 WHERE owneremail = $2 AND id = $3",
        [email, owneremail, id]
      );
    }

    if (phone) {
      const updateUserContact = await pool.query(
        "UPDATE contacts SET phone = $1 WHERE owneremail = $2 AND id = $3",
        [phone, owneremail, id]
      );
    }

    if (houseaddress) {
      const updateUserContact = await pool.query(
        "UPDATE contacts SET houseaddress = $1 WHERE owneremail = $2 AND id = $3",
        [houseaddress, owneremail, id]
      );
    }

    res.json("Contact's details have been updated");
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const deleteUserContact = async (req, res) => {
  const { owneremail, id } = req.params;
  if (!owneremail) {
    return res.json("Owner's email is required");
  }
  if (!id) {
    return res.json("Contact's id is required");
  }

  try {
    const userContacts = await pool.query(
      "DELETE FROM contacts WHERE id = $1 AND owneremail = $2",
      [id, owneremail]
    );

    res.json("Contact's details have been deleted");
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};
