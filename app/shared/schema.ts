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
