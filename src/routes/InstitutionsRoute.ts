import express from "express";
import {delete_staff, get_admin, get_all_institutions, search_institution, get_all_staffs, get_id, update_staff, create_staff, create_multiple_staffs } from "../controllers/InstitutionsControllers.js";
import async_middleware from "../middleware/AsyncMiddleware.js";
import { authrizeToken } from "../middleware/Authorise.js";

const route = express.Router();

import multer from "multer"
const upload = multer({ dest: 'upload/' });

/* REG. INSTITUTION ROUTES */
route.get("/search-institutions/", async_middleware(search_institution)); 

route.get("/get-institute/:id", async_middleware(get_id)); 
route.get("/get-all", async_middleware(get_all_institutions)); 
route.get("/get-all-staffs/:institution_id", async_middleware(get_all_staffs)); 

route.get("/admin", [ authrizeToken ], async_middleware(get_admin));

route.post("/create-staff", [authrizeToken], async_middleware(create_staff));
route.post("/create-multiple-staffs", [ upload.single('file'), authrizeToken], async_middleware(create_multiple_staffs));

/* REG. INST CUM STAFF ROUTES */
route.put("/update-staff/:id", async_middleware(update_staff));
route.delete("/delete-staff/:id", async_middleware(delete_staff));

export default route;
