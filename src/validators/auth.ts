import z from "zod";

export const registrationSchema = z.object({
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .min(1, { message: "Email is required" })
        .max(250, { message: "Email must be less than 250 characters" }),
    password: z
        .string()
        .min(1, { message: "Password is requried" })
        .min(8, { message: "Password must be at least 8 characters" }),
    role: z.enum(["admin", "user"]).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const loginSchema = z.object({
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is requried" }),
});

export type LoginInput = z.infer<typeof loginSchema>;
