import { z } from 'zod';

export const blingProductSchema = z.object({
  id: z.number().optional(),
  nome: z.string(),
  codigo: z.string().optional(),
  preco: z.number(),
  precoCusto: z.number(),
  estoque: z.unknown().optional(),
  tipo: z.string().optional(),
  situacao: z.string().optional(),
  formato: z.string().optional(),
  descricaoCurta: z.string().optional(),
  imagemURL: z.string().optional(),
});

export const blingProductResponseSchema = z.object({
  data: z.array(blingProductSchema),
});

export type BlingProduct = z.infer<typeof blingProductSchema>;
export type BlingProductResponse = z.infer<typeof blingProductResponseSchema>;
