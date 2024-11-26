import { Request, Response } from "express";

async function create_institution(_: Request, res: Response) {
  res.status(200).json({ msg: "create_institution", sucess: true });
}

async function get_all_institutions(_: Request, res: Response) {
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
