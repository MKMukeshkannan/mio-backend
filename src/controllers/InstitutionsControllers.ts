import { Request, Response } from "express";
import { pool } from "../utils/config.js";
import { InstitutionType, InstitutionId, StaffType, InstitutionsSearchParams, StaffCreation } from "../utils/validators.js";
import { z } from "zod";
import bcrypt from 'bcrypt';

import pkg from 'xlsx';
const { readFile } = pkg;

async function search_institution(req: Request, res: Response) {
  const { query } = InstitutionsSearchParams.parse(req.query)
  const response = (await pool.query("SELECT ins_id, name FROM institutions WHERE name ~* $1;", [query])).rows;
  res.status(200).json({ msg: "got all data", sucess: true, result: response });
};

async function get_all_institutions(_: Request, res: Response) {
  const result = await pool.query("SELECT * FROM institutions;");
  const all_institutions: InstitutionType[]  = result.rows;
  res.status(200).json({ msg: "got all data", sucess: true, data: all_institutions });
}

async function get_admin(req: Request, res: Response) {
  const IdValidator = z.object({id: z.string().uuid()});
  const { id } = IdValidator.parse(req.body.user);

  const data: InstitutionType = (await pool.query("SELECT * FROM institutions WHERE ins_id=$1;", [ id ])).rows[0];
  if (!data) return res.status(404).json({msg: "The user is not found", sucess: false});

  const filtered_data = { 
    id: data.ins_id, 
    name: data.name, 
    address: data.address, 
    founded_year: data.founded_year,
    url: data.logo_url,
    phone_number: data.phone_number,
    website: data.website,
    mail: data.mail
  };

  res.status(200).json({ data: filtered_data, msg: "Retrived your profile sucessfully !!!", sucess: true });
}

async function get_id(req: Request, res: Response) {
  const institution_id = InstitutionId.parse(req.params.id);

  const data: InstitutionType = (await pool.query("SELECT * FROM institutions WHERE ins_id=$1;", [ institution_id ])).rows[0];
  if (!data) return res.status(404).json({msg: "The user is not found", sucess: false});

  const filtered_data = { 
    id: data.ins_id, 
    name: data.name, 
    address: data.address, 
    founded_year: data.founded_year,
    url: data.logo_url,
    phone_number: data.phone_number,
    website: data.website,
    mail: data.mail
  };

  res.status(200).json({ data: filtered_data, msg: "Retrived your profile sucessfully !!!", sucess: true });
}

async function get_all_staffs(req: Request, res: Response) {
  const institution_id = InstitutionId.parse(req.params.institution_id);
  const result = await pool.query("SELECT * FROM staffs WHERE institution=$1;", [institution_id]);
  const UserData: StaffType[] = result.rows;

  res.status(200).json({ msg: "got all the staffs belong to the given institution,", sucess: true, UserData });
}

async function create_staff(req: Request, res: Response) {
  const {name, department, email, phone_number, password } = StaffCreation.parse(req.body);
  const IdValidator = z.object({id: z.string().uuid()});
  const { id } = IdValidator.parse(req.body.user);

  const hashed_password = await bcrypt.hash(password, 10);

  const params = [name, email, phone_number, department, id, hashed_password];
  await pool.query(`INSERT INTO staffs (name, email, phone_number, department, institution, hashed_password) VALUES ($1, $2, $3, $4, $5, $6);`, params);

  res.status(200).json({ msg: "staff created ", sucess: true });
}

async function create_multiple_staffs(req: Request, res: Response) {
  const file = req.file?.path;
  const IdValidator = z.object({id: z.string().uuid()});
  const { id } = IdValidator.parse(req.body.user);

  if (!file) return res.status(400).json({msg: "didn't receive the file"});

  const workbook = readFile(file);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  let all_params = [];
  for (let i = 2; i < 5; ++i) {
    let param = [];
    param.push(worksheet[`A${i}`]?.v);
    param.push(worksheet[`B${i}`]?.v);
    param.push(worksheet[`C${i}`]?.v);
    const hashed_password = await bcrypt.hash(worksheet[`D${i}`]?.v, 10);
    param.push(hashed_password);
    param.push(worksheet[`E${i}`]?.v);
    param.push(worksheet[`F${i}`]?.v);
    param.push(id);

    all_params.push(param)
  }

  console.log(all_params);

  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    /// for (let x of all_params) {
      await client.query("INSERT INTO staffs (name, email, phone_number, hashed_password, department, google_scholer_id, institution) VALUES ( $1 ,$2 ,$3 ,$4 ,$5 ,$6);", all_params);
    /// };

    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    throw e
  } finally {
    client.release()
  }

  res.status(200).json({ msg: "multiple staff", sucess: true });
}

async function update_institution(_: Request, res: Response) {
  res.status(200).json({ msg: "update_institution", sucess: true });
}

async function update_staff(_: Request, res: Response) {
  res.status(200).json({ msg: "update_staff", sucess: true });
}

async function delete_staff(_: Request, res: Response) {
  res.status(200).json({ msg: "delete_staff", sucess: true });
}

export { get_all_institutions, create_staff, create_multiple_staffs, search_institution, get_id, get_all_staffs, update_institution, update_staff, delete_staff, get_admin};
