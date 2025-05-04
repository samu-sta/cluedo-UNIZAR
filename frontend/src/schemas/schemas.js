import { z } from "zod";

const RegisterUserSchema = z.object({
  username: z.string()
    .min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres" })
    .max(255, { message: "El nombre de usuario no puede exceder los 255 caracteres" }),
  email: z.string()
    .email({ message: "Formato de email inválido" })
    .max(255, { message: "El email no puede exceder los 255 caracteres" }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(255, { message: "La contraseña no puede exceder los 255 caracteres" }),
  confirmPassword: z.string()
    .min(6, { message: "La confirmación de contraseña debe tener al menos 6 caracteres" })
    .max(255, { message: "La confirmación de contraseña no puede exceder los 255 caracteres" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
});

const LoginUserSchema = z.object({
  email: z.string()
    .email({ message: "Formato de email inválido" })
    .max(255, { message: "El email no puede exceder los 255 caracteres" }),
  password: z.string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
    .max(255, { message: "La contraseña no puede exceder los 255 caracteres" }),
});

function validateRegisterUser(data) {
  return RegisterUserSchema.safeParse(data);
}

function validateLoginUser(data) {
  return LoginUserSchema.safeParse(data);
}

export const userSchema = {
  validateRegisterUser,
  validateLoginUser
};