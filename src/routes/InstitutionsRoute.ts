import express from "express";
import {delete_staff, get_admin, get_all_institutions, search_institution, get_all_staffs, get_id, update_staff } from "../controllers/InstitutionsControllers.js";
import async_middleware from "../middleware/AsyncMiddleware.js";
import { authrizeToken } from "../middleware/Authorise.js";

const route = express.Router();

/* REG. INSTITUTION ROUTES */
route.get("/search-institutions/", async_middleware(search_institution)); 

route.get("/admin", [ authrizeToken ], async_middleware(get_admin));
route.get("/get-all/:id", async_middleware(get_id)); 
route.get("/get-all", async_middleware(get_all_institutions)); 

/* REG. INST CUM STAFF ROUTES */
route.get("/get-all-staffs/:institution_id", async_middleware(get_all_staffs)); 
route.put("/update-staff/:id", async_middleware(update_staff));
route.delete("/delete-staff/:id", async_middleware(delete_staff));

export default route;
