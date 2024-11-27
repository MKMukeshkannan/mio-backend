import { z } from "zod";

const InstitutionSchema = z.object({
  ins_id: z.string(),
  name: z.string({required_error: "Name is required", invalid_type_error: "Name must be a string", }).min(6).max(30),
  address: z.string({required_error: "Address is required"}).min(10).max(20),
  logo_url: z.string({required_error: "logo is required"}).url(),
  founded_year: z.number({required_error: "founded year is required"}).positive().gt(1500).lt(2025),
  phone_number: z.string({required_error: "phone number is required"}).length(10),
  mail: z.string({required_error: "mail is required"}).email(),
  website: z.string({required_error: "website is required"}).url(),
  username: z.string({required_error: "username is required"}).min(6).max(12),
  password: z.string({required_error: "password is required"}),
});

const InstitutionCreation = InstitutionSchema.omit({ins_id: true,});

export { InstitutionSchema, InstitutionCreation };
