import express from "express";
import { get_refresh_token, institute_login, institute_signup, log_out, staff_login, staff_signup } from "../controllers/AuthControllers.js";
import async_middleware from "../middleware/AsyncMiddleware.js";

const route = express.Router();

route.post("/institute/signup", async_middleware(institute_signup));
route.post("/institute/login", async_middleware(institute_login));
route.post("/staff/signup", async_middleware(staff_signup));
route.post("/staff/login", async_middleware(staff_login));

route.get("/logout", async_middleware(log_out));
route.get("/refresh_token", async_middleware(get_refresh_token));

export default route;
