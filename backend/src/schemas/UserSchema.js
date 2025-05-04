/*************************************************
 * Esquema de Usuario
 * 
 * Este archivo define los esquemas de validación para
 * las operaciones de registro e inicio de sesión de
 * usuarios, utilizando la biblioteca Zod para garantizar
 * la integridad de los datos.
 * 
 * Autor: DANIEL SANAGUSTIN
 *************************************************/

import zod from 'zod';

const RegisterUserSchema = zod.object({
  username: zod.string().min(3).max(255),
  email: zod.string().email().max(255),
  password: zod.string().min(6).max(255),
});

const LoginUserSchema = zod.object({
  email: zod.string().email().max(255),
  password: zod.string().min(6).max(255),
});

function validateRegisterUser(data) {
  return RegisterUserSchema.safeParse(data);
}

function validateLoginUser(data) {
  return LoginUserSchema.safeParse(data);
}

const userSchema = {
  validateRegisterUser,
  validateLoginUser
};

export default userSchema;