import express from "express";
import async_middleware from "../middleware/AsyncMiddleware.js";
import { create_publication, get_staff_id, get_staff_publication } from "../controllers/StaffController.js";

const route = express.Router();

/* REG. STAFF ROUTES */
route.get("/get-staff-id/:staff_id", async_middleware(get_staff_id));
route.get("/get-staff-publication/:staff_id", async_middleware(get_staff_publication));
route.post("/create-publication", async_middleware(create_publication));

export default route;
