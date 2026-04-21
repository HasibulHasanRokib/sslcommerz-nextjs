import { z } from "zod";

export const checkoutSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^(?:\+88)?01[3-9]\d{8}$/, "Invalid phone number"),
  address: z.string().min(10, "Address is required"),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
