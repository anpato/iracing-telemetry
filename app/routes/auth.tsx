import {
  Tabs,
  Tab,
  Card,
  CardBody,
  CardHeader,
  Divider
} from '@nextui-org/react';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Outlet, useLocation } from '@remix-run/react';
import { useEffect } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname === '/auth') {
    return redirect('/auth/login');
  }

  return null;
}

export default function Auth() {
  const { pathname } = useLocation();

  return (
    <div className="flex flex-col justify-center items-center w-screen h-screen">
      <Card className="min-w-[400px] min-h-[300px]">
        <CardHeader>
          <Tabs
            color="primary"
            defaultSelectedKey={'/login'}
            fullWidth
            selectedKey={pathname}
            aria-label="Options"
          >
            <Tab href="/auth/login" key="/auth/login" title="Login" />
            <Tab href="/auth/register" key="/auth/register" title="Register" />
          </Tabs>
        </CardHeader>
        <Divider />
        <CardBody>
          <Outlet />
        </CardBody>
      </Card>
    </div>
  );
}
