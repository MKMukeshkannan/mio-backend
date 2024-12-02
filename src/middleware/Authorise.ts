import { NextFunction, Request, Response } from "express";
import pkg from "jsonwebtoken";
import { JWT_SECRET } from "../utils/config.js";

const { verify } = pkg;

function authrizeToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).send("Unautharized");
  if (!JWT_SECRET) throw new Error("invalid token");

  verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).send(err);
    req.body.user = user;

    next();
  });
}

export { authrizeToken };
