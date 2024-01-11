import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { clearSession, supabaseServer } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, response } = supabaseServer(request);
  await clearSession(client);
  return redirect('/', { headers: response.headers });
};
