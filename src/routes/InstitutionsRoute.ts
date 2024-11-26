import express from "express";
import { create_institution, create_staff, delete_staff, get_all_institutions, get_all_staffs, get_id, login_institution, update_staff } from "../controllers/InstitutionsControllers.js";
import async_middleware from "../middleware/AsyncMiddleware.js";

const route = express.Router();

/* REG. INSTITUTION ROUTES */
route.get("/get-all/:id", async_middleware(get_id)); 
route.get("/get-all", async_middleware(get_all_institutions)); 
route.post("/login", async_middleware(login_institution)); 
route.post("/create-institute", async_middleware(create_institution)); 
route.put("/update-institute", async_middleware(create_institution)); 

/* REG. INST CUM STAFF ROUTES */
route.get("/get-all-staffs", async_middleware(get_all_staffs)); 
route.post("/create-staff", async_middleware(create_staff)); 
route.put("/update-staff/:id", async_middleware(update_staff));
route.delete("/delete-staff/:id", async_middleware(delete_staff));

export default route;
