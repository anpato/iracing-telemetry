import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, redirect } from '@remix-run/react';
import { StatusCodes } from 'http-status-codes';
import Navigation from '~/components/navigation';
import { getAuthorizedSession, supabaseServer } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { client, response } = supabaseServer(request);
  const session = await getAuthorizedSession(client);
  if (!session) {
    await client.auth.signOut();
    throw redirect('/', {
      headers: response.headers,
      status: StatusCodes.UNAUTHORIZED
    });
  }
  return null;
};

export default function Dashboard() {
  return (
    <>
      <Navigation />
      <main className="my-4 p-2">
        <Outlet />
      </main>
    </>
  );
}
