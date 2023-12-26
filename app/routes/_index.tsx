import { redirect } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';

export function loader() {
  return redirect('/dashboard');
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  return (
    <main>
      <Outlet />
    </main>
  );
}
