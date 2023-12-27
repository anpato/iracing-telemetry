import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { supabaseServer } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const response = new Response();
  if (code) {
    const { client } = supabaseServer(request, response);
    await client.auth.exchangeCodeForSession(code);
  }

  return redirect('/', { headers: response.headers });
};
