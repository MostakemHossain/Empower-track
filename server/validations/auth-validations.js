
import { z } from "zod";

export const loginValidationSchema = z.object({
  body: z.object({
    identifier: z.string({
      required_error: "Email or Employee ID is required",
    }),
    password: z.string({
      required_error: "Password is required",
    }),
  }),
});

export const AuthValidation={
    loginValidationSchema
}
