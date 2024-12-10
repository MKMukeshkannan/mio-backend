import express from "express";
import async_middleware from "../middleware/AsyncMiddleware.js";
import { create_publication, get_staff_id, get_staff_publication, populate_staff_citation, update_staff } from "../controllers/StaffController.js";

const route = express.Router();

/* REG. STAFF ROUTES */
route.get("/get-staff-id/:staff_id", async_middleware(get_staff_id));
route.get("/get-staff-publication/:staff_id", async_middleware(get_staff_publication));
route.post("/create-publication", async_middleware(create_publication));
route.post("/populate-staff-citation/:staff_id", async_middleware(populate_staff_citation));
route.post("/update-staff", async_middleware(update_staff));


export default route;
