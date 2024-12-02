import { Request, Response } from "express";
import { InstitutionType, InstitutionCreation, Login, StaffCreation, StaffType, SessionType } from "../utils/validators.js";
import bcrypt from 'bcrypt';
import { generate_access_token, generate_refresh_token, pool, REFRESH_SECRET } from "../utils/config.js";
import jsonwebtoken from 'jsonwebtoken';

const { verify } = jsonwebtoken;

async function institute_login(req: Request, res: Response) {
  const {username, password} = Login.parse(req.body);
  const result = await pool.query("SELECT * FROM institutions WHERE username=$1", [username]);

  if (!result.rowCount) return res.status(400).send("Email do not exist"); 
  const institution_data: InstitutionType = result.rows[0];
  if (await bcrypt.compare(password, institution_data.hashed_password)) {
    const access_token = generate_access_token({
      id: institution_data.ins_id,
      name: institution_data.name,
      type: 'INS',
      email: institution_data.mail,
    });
    const refresh_token = generate_refresh_token({
      id: institution_data.ins_id,
      name: institution_data.name,
      email: institution_data.mail,
    });

    await pool.query( "INSERT INTO sessions (id, refresh_token, type) VALUES ($1, $2, $3)", [institution_data.ins_id, refresh_token, "INS"]);

    res.cookie("jwt", refresh_token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, });
    res.status(200).json({ sucess: true, msg: "sucessfully autheticated", name: institution_data.name, email: institution_data.mail, access_token, });
  } else {
    res.status(401).json({sucess: false, msg: "password is wrong"});
  };
};

async function institute_signup(req: Request, res: Response) {
  if (!req.body) return;
  const {
    password, phone_number, founded_year, address,
    logo_url, mail, name, username, website } = InstitutionCreation.parse(req.body);

  const hashed_password = await bcrypt.hash(password, 10);

  const params = [name, address, logo_url, founded_year, phone_number, mail, website, username, hashed_password];
  await pool.query(`INSERT INTO institutions ( name, address, logo_url, founded_year, phone_number, mail, website, username, hashed_password ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, params);

  res.status(200).json({ msg: "created record sucessfully", sucess: true });
}

async function staff_login(req: Request, res: Response) {
  const {username, password} = Login.parse(req.body);
  const result = await pool.query("SELECT * FROM staffs WHERE username=$1", [username]);

  if (!result.rowCount) return res.status(400).send("Email do not exist"); 
  const staff_data: StaffType = result.rows[0];
  if (await bcrypt.compare(password, staff_data.hashed_password)) {
    const access_token = generate_access_token({
      id: staff_data.staff_id,
      name: staff_data.name,
      type: "STF",
      email: staff_data.email,
    });
    const refresh_token = generate_refresh_token({
      id: staff_data.staff_id,
      name: staff_data.name,
      email: staff_data.email,
    });

    await pool.query( "INSERT INTO sessions (id, refresh_token) VALUES ($1, $2, $3)", [staff_data.staff_id, refresh_token, "STF"]);

    res.cookie("jwt", refresh_token, { httpOnly: true, sameSite: "none", secure: true, maxAge: 7 * 24 * 60 * 60 * 1000, });
    res.status(200).json({ sucess: true, msg: "sucessfully autheticated", name: staff_data.name, email: staff_data.email, access_token, });
  } else {
    res.status(401).json({sucess: false, msg: "password is wrong"});
  };
}

async function staff_signup(req: Request, res: Response) {
  if (!req.body) return;
  const { name, phone_number, username, department, designation, email, institution, profile_picture, password } = StaffCreation.parse(req.body);
  const hashed_password = await bcrypt.hash(password, 10);

  const params = [ name, designation, email, phone_number, department, profile_picture, institution, username, hashed_password ];
  await pool.query(`INSERT INTO staffs ( name, designation, email, phone_number, department, profile_picture, institution, username, hashed_password ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`, params);

  res.status(200).json({ msg: "created staff record sucessfully", sucess: true });
}

async function log_out(req: Request, res: Response) {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(204);
  const refresh_token = cookie.jwt;

  const result = await pool.query( "SELECT * FROM sessions WHERE refresh_token = $1", [refresh_token]);
  const data = result.rows[0];
  if (!data) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    return res.sendStatus(203);
  }

  await pool.query("DELETE FROM sessions WHERE refresh_token=$1", [ refresh_token ]);
  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true, });
  res.sendStatus(204);
}


async function get_refresh_token(req: Request, res: Response) {
  const cookie = req.cookies;
  if (!cookie?.jwt) return res.sendStatus(401);
  const refresh_token = cookie.jwt;

  const result: SessionType = (await pool.query( "SELECT * FROM sessions WHERE refresh_token = $1", [refresh_token])).rows[0];
  if (!result) return res.sendStatus(404);

  if (!REFRESH_SECRET) throw new Error("invalid token");

  if (result.type == "INS") {
    const data: InstitutionType = (await pool.query("SELECT * FROM institutions WHERE ins_id=$1", [ result.id ])).rows[0];
    verify(refresh_token, REFRESH_SECRET, (err: any, decoded: any) => {
      if (err || data.ins_id !== decoded.id) return res.sendStatus(404);
      const access_token = generate_access_token({
        id: data.ins_id,
        name: data.name,
        type: "INS",
        email: data.mail,
      });

      return res.status(200).json({ name: data.name, email: data.mail, access_token, });
    });

  } else if (result.type === "STF") {
    const data: StaffType = (await pool.query("SELECT * FROM staffs WHERE staff_id=$1", [ result.id ])).rows[0];
    verify(refresh_token, REFRESH_SECRET, (err: any, decoded: any) => {
      if (err || data.staff_id !== decoded.id) return res.sendStatus(403);
      const access_token = generate_access_token({
        id: data.staff_id,
        name: data.name,
        type: "STF",
        email: data.email,
      });

      return res.status(200).json({ name: data.name, email: data.email, access_token, });
    });
  } 

  res.status(403).json({msg: "invalid type", sucess: false});
}


export { institute_login, institute_signup, staff_login, staff_signup, log_out, get_refresh_token};
