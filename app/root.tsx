import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate,
  useRevalidator,
  useRouteError
} from '@remix-run/react';
import styles from '~/styles.css';
import { NextUIProvider } from '@nextui-org/react';
import electron from '~/electron.server';
import SocketProvider from '~/store/socket.context';
import { themeSessionResolver } from '~/session.server';
import {
  PreventFlashOnWrongTheme,
  ThemeProvider,
  useTheme
} from 'remix-themes';
import { ToastContainer } from 'react-toastify';
import toastStyles from 'react-toastify/dist/ReactToastify.css';
import { createBrowserClient } from '@supabase/auth-helpers-remix';
import { useEffect, useState } from 'react';
import { supabaseServer } from '~/utils/supabase.server';
import * as Sentry from '@sentry/remix';
export const meta: MetaFunction = () => [{ title: 'New Remix App' }];

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toastStyles },
  { rel: 'stylesheet', href: styles }
];

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://5a20319e63be94cd9533a19e7349df95@o4505892775395328.ingest.sentry.io/4506466266906624',
    tracesSampleRate: 1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1,
    enabled: true
  });
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  Sentry.captureRemixErrorBoundaryError(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <p>{JSON.stringify(error)}</p>
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const platform = request.headers.get('user-agent');
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY
  };

  const { client, response } = supabaseServer(request);

  const {
    data: { session }
  } = await client.auth.getSession();

  const currDevice: 'desktop' | 'web' = platform?.includes('remix-electron')
    ? 'desktop'
    : 'web';
  return json(
    {
      theme: getTheme(),
      isOnline: currDevice === 'web' ? true : electron?.net.isOnline(),
      env,
      session
    },
    { headers: response.headers }
  );
}

export default function Application() {
  const { theme } = useLoaderData<typeof loader>();
  return (
    <ThemeProvider specifiedTheme={theme} themeAction="/set-theme">
      <App />
    </ThemeProvider>
  );
}

function App() {
  const {
    isOnline,
    theme: storedTheme,
    env,
    session
  } = useLoaderData<typeof loader>();

  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );
  const { revalidate } = useRevalidator();
  const [theme] = useTheme();
  const navigate = useNavigate();
  const serverAccessToken = session?.access_token;

  useEffect(() => {
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverAccessToken) {
        // server and client are out of sync.
        revalidate();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [serverAccessToken, supabase, revalidate]);

  return (
    <html lang="en" data-theme={theme ?? ''}>
      <head>
        <meta charSet="utf8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(storedTheme)} />
        <Links />
      </head>

      <body>
        <NextUIProvider navigate={navigate}>
          <SocketProvider isOnline={isOnline}>
            <Outlet context={{ supabase }} />
            <ToastContainer theme={theme ?? 'colored'} />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </SocketProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
