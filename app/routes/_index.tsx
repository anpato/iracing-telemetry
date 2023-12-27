import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { supabaseServer } from '~/utils/supabase.server';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, response } = supabaseServer(request);

  const {
    data: { session }
  } = await client.auth.getSession();

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
