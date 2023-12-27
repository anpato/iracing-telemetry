import {
  SupabaseClient,
  createServerClient
} from '@supabase/auth-helpers-remix';
import { Database } from '~/shared/db';
import 'dotenv/config';

export const supabaseServer = (
  request: Request,
  response: Response = new Response()
): { client: SupabaseClient<Database>; response: Response } => {
  return {
    client: createServerClient<Database>(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        request,
        response
      }
    ),
    response
  };
};
