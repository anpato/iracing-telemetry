import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { getAuthorizedSession, supabaseServer } from '~/utils/supabase.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, response } = supabaseServer(request);

  const session = await getAuthorizedSession(client);

  if (!session) {
    return redirect('/auth', { headers: response.headers });
  }
  return redirect('/dashboard', { headers: response.headers });
}

export default function Index() {
  return (
    <main>
      <Outlet />
    </main>
  );
}
