import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { pool } from "../utils/config.js";
import { InstitutionCreation } from "../utils/validators.js";

async function get_all_institutions(_: Request, res: Response) {
  res.status(200).json({ msg: "create_institution", sucess: true });
}

async function create_institution(req: Request, res: Response) {
  if (!req.body) return;
  const {
    password, phone_number, founded_year, address,
    logo_url, mail, name, username, website } = InstitutionCreation.parse(req.body);

  const hashed_password = bcrypt.hash(password, 10);

  const params = [name, address, logo_url, founded_year, phone_number, mail, website, username, hashed_password];
  await pool.query(`INSERT INTO institutions ( name, address, logo_url, founded_year, phone_number, mail, website, username, hashed_password ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, params);

  res.status(200).json({ msg: "get_all_institutions", sucess: true });
}

async function get_id(_: Request, res: Response) {
  res.status(200).json({ msg: "get_id", sucess: true });
}

async function update_institution(_: Request, res: Response) {
  res.status(200).json({ msg: "update_institution", sucess: true });
}

async function login_institution(_: Request, res: Response) {
  res.status(200).json({ msg: "create_institution", sucess: true });
}

async function create_staff(_: Request, res: Response) {
  res.status(200).json({ msg: "create_staff", sucess: true });
}

async function get_all_staffs(_: Request, res: Response) {
  res.status(200).json({ msg: "get_all_staffs", sucess: true });
}

async function update_staff(_: Request, res: Response) {
  res.status(200).json({ msg: "update_staff", sucess: true });
}

async function delete_staff(_: Request, res: Response) {
  res.status(200).json({ msg: "delete_staff", sucess: true });
}

export {
  get_all_institutions,
  get_id,
  get_all_staffs,
  update_institution,
  update_staff,
  create_institution,
  create_staff,
  delete_staff,
  login_institution,
};
