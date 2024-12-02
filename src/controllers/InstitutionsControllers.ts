import { Request, Response } from "express";
import { pool } from "../utils/config.js";
import { InstitutionType, InstitutionId, StaffType } from "../utils/validators.js";
import { z } from "zod";

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

async function get_id(_: Request, res: Response) {
  res.status(200).json({ msg: "get_id", sucess: true });
}

async function update_institution(_: Request, res: Response) {
  res.status(200).json({ msg: "update_institution", sucess: true });
}

async function get_all_staffs(req: Request, res: Response) {
  const institution_id = InstitutionId.parse(req.params.institution_id);
  const result = await pool.query("SELECT * FROM staffs WHERE institution=$1;", [institution_id]);
  const UserData: StaffType[] = result.rows;

  res.status(200).json({ msg: "got all the staffs belong to the given institution,", sucess: true, UserData });
}

async function update_staff(_: Request, res: Response) {
  res.status(200).json({ msg: "update_staff", sucess: true });
}

async function delete_staff(_: Request, res: Response) {
  res.status(200).json({ msg: "delete_staff", sucess: true });
}

export { get_all_institutions, get_id, get_all_staffs, update_institution, update_staff, delete_staff, get_admin};
