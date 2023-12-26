import type {
  LinksFunction,
  LoaderFunctionArgs,
  MetaFunction
} from '@remix-run/node';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigate
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

export const meta: MetaFunction = () => [{ title: 'New Remix App' }];

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: toastStyles },
  { rel: 'stylesheet', href: styles }
];

export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request);
  const platform = request.headers.get('user-agent');

  const currDevice: 'desktop' | 'web' = platform?.includes('remix-electron')
    ? 'desktop'
    : 'web';
  return {
    theme: getTheme(),
    isOnline: currDevice === 'web' ? true : electron?.net.isOnline()
  };
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
  const { isOnline, theme: storedTheme } = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  const navigate = useNavigate();
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
            <Outlet />
            <ToastContainer />
            <ScrollRestoration />
            <Scripts />
            <LiveReload />
          </SocketProvider>
        </NextUIProvider>
      </body>
    </html>
  );
}
