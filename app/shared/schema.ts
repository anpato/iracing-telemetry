import { zodResolver } from '@hookform/resolvers/zod';
import { z as zod } from 'zod';

type ZodSchema = {
  schema: zod.Schema;
  resolver: () => any;
};

export const SearchSchema: ZodSchema = {
  schema: zod.object({
    query: zod
      .string({
        required_error: 'A search term is required. Either a track or car.'
      })
      .min(3, 'Search criteria must contain at least 3 characters.')
      .nullable()
  }),
  resolver() {
    return zodResolver(this.schema);
  }
};

export type SearchFormData = zod.infer<typeof SearchSchema.schema>;

export const LoginSchema: ZodSchema = {
  schema: zod.object({
    email: zod
      .string({
        required_error: 'Email is required.'
      })
      .email(),
    password: zod.string({ required_error: 'Password is required.' }).min(6)
  }),
  resolver() {
    return zodResolver(this.schema);
  }
};
export type LoginFormData = zod.infer<typeof LoginSchema.schema>;

export const RegisterSchema: ZodSchema = {
  schema: zod.object({
    email: zod.string({ required_error: 'Email is required.' }).email(),
    password: zod
      .string({ required_error: 'Password is required.' })
      .min(6, 'Password must contain atleast 6 characters.'),
    confirmPassword: zod
      .string({ required_error: 'Passwords much match.' })
      .min(6, 'Password must contain atleast 6 characters.')
  }),
  resolver() {
    return zodResolver(this.schema);
  }
};

export type RegisterFormData = zod.infer<typeof RegisterSchema.schema>;
