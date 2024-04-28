import db from "../config/databases/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userControllers = {};
export const getUserById = async (id) => {
  const [data] = await db.query(
    `
  SELECT *
  FROM Users
  WHERE id = ?`,
    [id]
  );
  const { password, ...user } = data[0];
  return user;
};
export const signUp = async (req, res) => {
  const { name, email, password } = req.body;
  if (isOfType({ name, email, password }, UserSignUp)) {
  }
  const userExists = await checkIfUserExists(email);
  if (!userExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [data] = await db.query(
      `
    INSERT INTO Users (name, email, password)
    VALUES (?, ?, ?)`,
      [name, email, hashedPassword]
    );
    const user = await userControllers.getUserById(data.insertId);
    res.status(201).send({
      message: "success",
      user,
    });
  } else {
    res.status(400).send({
      status: "failed",
      message: "user already exists",
    });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExists = await checkIfUserExists(email);
    if (userExists) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        userExists.password
      );
      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            id: userExists.id,
            email: userExists.email,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: 3600 * 24 * 7,
          }
        );
        res.send({
          status: "success",
          token,
          user: {
            id: userExists.id,
            name: userExists.name,
            email: userExists.email,
          },
        });
      } else {
        res.status(400).send({
          status: "failed",
          message: "wrong password",
        });
      }
    } else {
      res.status(400).send({
        status: "Failed",
        message: "Email address not found",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ status: "Failed", message: "Internal server error" });
  }
};

const checkIfUserExists = async (email) => {
  try {
    const [user, _] = await db.query(
      `
        SELECT *
        FROM Users
        WHERE email = ?
        `,
      email
    );
    return user[0];
  } catch (error) {
    console.log(error.message);
  }
};
export default userControllers;
