import { z } from "zod";

const InstitutionSchema = z.object({
  ins_id: z.string(),
  name: z.string({required_error: "Name is required", invalid_type_error: "Name must be a string", }).min(6).max(50),
  address: z.string({required_error: "Address is required"}).min(10).max(100),
  logo_url: z.string({required_error: "logo is required"}).url(),
  founded_year: z.number({required_error: "founded year is required"}).positive().gt(1500).lt(2025),
  phone_number: z.string({required_error: "phone number is required"}).length(10),
  mail: z.string({required_error: "mail is required"}).email(),
  website: z.string({required_error: "website is required"}).url(),
  username: z.string({required_error: "username is required"}).min(6).max(12),
  password: z.string({required_error: "password is required"}),
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
    password: z.string({required_error: "password: is required"}),
});

const InstitutionCreation = InstitutionSchema.omit({ins_id: true,});
const StaffCreation = StaffSchema.omit({staff_id: true,});

type InstitutionType = z.infer<typeof InstitutionSchema>;
type StaffType = z.infer<typeof StaffSchema>;


export { InstitutionCreation, InstitutionId, StaffCreation, InstitutionType, StaffType};
