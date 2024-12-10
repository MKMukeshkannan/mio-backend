import { Request, Response } from "express";
import { bucket } from "../utils/config.js";
import { z } from "zod";

async function get_staff_pp (req: Request, res: Response){
    const Staffid = z.string().uuid()
    const staff_id = Staffid.parse(req.params.staff_id);
    const profile = bucket.storage.from('pcdn').getPublicUrl(`staff/${staff_id}.png`);
    res.status(200).json({msg: "got staff profile picture", success: true, profile});
}

async function get_institute_blobs (req: Request, res: Response){
    const Instituteid = z.string().uuid()
    const institute_id = Instituteid.parse(req.params.institute_id);
    const banner = bucket.storage.from('pcdn').getPublicUrl(`institute/banner/${institute_id}.png`);
    const profile = bucket.storage.from('pcdn').getPublicUrl(`institute/profile/${institute_id}.png`);
    res.status(200).json({msg: "got institute blobs", success: true, banner, profile});
}

async function put_staff_pp (req: Request, res: Response){

}

async function put_institute_banner (req: Request, res: Response){

}

async function put_institute_logo (req: Request, res: Response){

}

export {get_staff_pp, get_institute_blobs, put_staff_pp, put_institute_banner, put_institute_logo};
