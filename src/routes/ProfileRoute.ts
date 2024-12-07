import express from "express";
import async_middleware from "../middleware/AsyncMiddleware.js";
import { get_profile } from "../controllers/ProfileController.js";

const route = express.Router();

/* REG. STAFF ROUTES */
route.get("/get-staff-profile/:staff_id", async_middleware(get_profile));

export default route;
