import { z } from 'zod';


// Define o schema de validação para a requisição
export const uploadMeasureSchema = z.object({
  image: z.string().base64('Invalid image format, should be Base64'),
  customer_code: z.string().min(1, "Customer code is required"),
  measure_datetime: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  measure_type: z.enum(["WATER", "GAS"]).refine((val) => ["WATER", "GAS"].includes(val), {
    message: "Invalid measure type",
  }),
});

// Tipos inferidos pelo Zod (opcional)
export type UploadMeasure = z.infer<typeof uploadMeasureSchema>;
