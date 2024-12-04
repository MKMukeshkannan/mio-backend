import { z } from "zod";

const InstitutionsSearchParams = z.object({
  query: z.string(),
  limit: z.number().optional(),
  offset: z.number().optional()
});

const InstitutionSchema = z.object({
  ins_id: z.string(),
  name: z.string({required_error: "Name is required", invalid_type_error: "Name must be a string", }).min(6).max(50),
  address: z.string({required_error: "Address is required"}).min(10).max(100).optional(),
  logo_url: z.string({required_error: "logo is required"}).url().optional(),
  founded_year: z.number({required_error: "founded year is required"}).positive().gt(1500).lt(2025).optional(),
  phone_number: z.string({required_error: "phone number is required"}).length(10),
  mail: z.string({required_error: "mail is required"}).email(),
  website: z.string({required_error: "website is required"}).url(),
  username: z.string({required_error: "username is required"}).min(6).max(12),
  hashed_password: z.string({required_error: "password is required"}),
});

const InstitutionId = z.string().uuid({ message: "Invalid UUID" });

const StaffSchema = z.object({
    staff_id: z.string({required_error: "staff_id: is required"}),
    name: z.string({required_error: "name: is required"}).min(10).max(30),
    designation: z.string({required_error: "designation: is required"}).min(3).max(30),
    email: z.string({required_error: "email: is required"}).email(),
    phone_number: z.string({required_error: "phone_number: is required"}).length(10),
    department: z.string({required_error: "department: is required"}).min(3).max(30),
    profile_picture: z.string({required_error: "profile_picture: is required"}).url(),
    institution: z.string({required_error: "institution: is required"}),
    username: z.string({required_error: "username: is required"}).min(6).max(30),
    hashed_password: z.string({required_error: "password: is required"}),
});

const Login = z.object({
    username: z.string({required_error: "username: is required"}).min(6).max(30),
    password: z.string({required_error: "password: is required"}),
});
const LoginDatabase = z.object({
    username: z.string({required_error: "username: is required"}).min(6).max(30),
    hashed_password: z.string({required_error: "password: is required"}),
});

const InstitutionCreation = InstitutionSchema.omit({ins_id: true, hashed_password: true }).extend({password: z.string({required_error: "Password is required" })});
const StaffCreation = StaffSchema.omit({staff_id: true, hashed_password: true}).extend({password: z.string({required_error: "Password is required" })});

const SessionSchema = z.object({
  id: z.string(),
  refresh_token: z.string(),
  type: z.string()
});

type InstitutionType = z.infer<typeof InstitutionSchema>;
type StaffType = z.infer<typeof StaffSchema>;
type LoginType = z.infer<typeof LoginDatabase>;
type SessionType = z.infer<typeof SessionSchema>;


export { InstitutionsSearchParams, InstitutionCreation, InstitutionId, StaffCreation, InstitutionType, StaffType, Login, LoginType, InstitutionSchema, StaffSchema, SessionType};
