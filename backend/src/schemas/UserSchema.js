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

const ChangePasswordSchema = zod.object({
  newPassword: zod.string().min(6).max(255),
  newPasswordConfirmation: zod.string().min(6).max(255),
}).refine(data => data.newPassword === data.newPasswordConfirmation, {
  message: 'Passwords do not match',
});

function validateRegisterUser(data) {
  return RegisterUserSchema.safeParse(data);
}

function validateLoginUser(data) {
  return LoginUserSchema.safeParse(data);
}

function validateChangePassword(data) {
  return ChangePasswordSchema.safeParse(data);
}


const userSchema = {
  validateRegisterUser,
  validateLoginUser,
  validateChangePassword,
};

export default userSchema;