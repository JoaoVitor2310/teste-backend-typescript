import { z } from 'zod';

export const confirmMeasureSchema = z.object({
  measure_uuid: z.string().min(36, 'Invalid Measure UUID'),
  confirmed_value: z.number().int('Confirmed value must be an integer'), // Mensagem de erro personalizada
});

// Inferência de tipos
export type ConfirmMeasure = z.infer<typeof confirmMeasureSchema>;
