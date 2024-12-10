import { Request, Response } from "express";
import { pool } from "../utils/config.js";
import { z } from "zod";

async function get_staff_id(req: Request, res: Response) {
  const IdValidator = z.string().uuid();
  const staff_id = IdValidator.parse(req.params.staff_id);

  console.log(staff_id);

  const data = (await pool.query("SELECT * FROM staffs WHERE staff_id = $1;", [staff_id])).rows[0];

  res.status(200).json({ msg: "got all data", sucess: true, data });
};

async function get_staff_publication(req: Request, res: Response) {
  const IdValidator = z.string();
  const staff_id = IdValidator.parse(req.params.staff_id);

  const data = (await pool.query("SELECT * FROM publications p, staffs s WHERE s.staff_id = $1 AND p.staff_id = s.staff_id;", [staff_id])).rows;

  res.status(200).json({ msg: "got all data", sucess: true, data });
};

async function create_publication(req: Request, res: Response) {
  const PublicationValidator = z.object({
    publisher: z.string().min(3).max(20),
    title: z.string().min(3).max(20),
    type: z.string(),
    description: z.string(),
    citation: z.number(),
    url: z.string(),
    year: z.number(),
    index: z.number(),
  });
  const {publisher, title, type, description, url, year, citation, } = PublicationValidator.parse(req.body);

  const params = [ title, type, publisher, description, citation, year, url ];
  await pool.query("INSERT INTO publications ( title, type, publisher, description, citation, year, url ) VALUES ($1, $2, $3, $4, $5, $6, $7);", params);
  
  res.status(200).json({ msg: "got all data", sucess: true });
};

async function update_staff(req: Request, res: Response) {
    const UpdateValidator = z.object({
        staff_id: z.string().uuid(),
        attribute: z.string(),
        value: z.string(),
    });
    const {staff_id, attribute , value} = UpdateValidator.parse(req.body);

    const params = [attribute, value, staff_id];
    await pool.query(`UPDATE staffs SET $1 = $2 WHERE staff_id = $3;`, params);

    res.status(200).json({ msg: "update sucessfull", sucess: true });
}

async function populate_staff_citation(req: Request, res: Response) {
    const UpdateValidator = z.object({
        staff_id: z.string().uuid(),
        year_citation: z.array(z.tuple([z.number(), z.number()])),
    });
    const {staff_id, year_citation} = UpdateValidator.parse(req.body);

    for (const [year, citation] of year_citation) {
        const params = [staff_id, year, citation];
        await pool.query(`INSERT INTO staff_year_citation (staff_id, year, citation) VALUES ($1, $2, $3);`, params);
    }

    res.status(200).json({ msg: "citation population is sucessfull", sucess: true });
}

export { get_staff_id, get_staff_publication, create_publication, update_staff, populate_staff_citation };
