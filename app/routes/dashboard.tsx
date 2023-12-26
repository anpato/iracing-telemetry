import { Outlet } from '@remix-run/react';
import Navigation from '~/components/navigation';

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
