import {
  Session,
  SupabaseClient,
  createServerClient
} from '@supabase/auth-helpers-remix';
import { Database } from '~/shared/db';
import 'dotenv/config';
import { getPlatform } from '~/utils/get-platform';
import { ElectronService } from '~/utils/electron.service';

export const supabaseServer = (
  request: Request,
  response: Response = new Response()
): { client: SupabaseClient<Database>; response: Response } => {
  const client = createServerClient<Database>(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      request,
      response
    }
  );

  return {
    client,
    response
  };
};

export const setAuthorizedSession = async (
  client: SupabaseClient<Database>,
  session: Session
) => {
  const platform = getPlatform();
  const ses = await client.auth.setSession(session);

  if (platform === 'desktop') {
    return ElectronService?.setSession(session);
  }

  return ses;
};

export const getAuthorizedSession = async (
  client: SupabaseClient<Database>
): Promise<Session | null> => {
  const platform = getPlatform();

  switch (platform) {
    // case 'desktop':
    //   return (await ElectronService?.getSession()) ?? null;
    default:
      const {
        data: { session },
        error
      } = await client.auth.getSession();

      if (!session) {
        await client.auth.signOut();
        return null;
      }
      return session;
  }
};

export const clearSession = async (client: SupabaseClient<Database>) => {
  return await client.auth.signOut();
};
