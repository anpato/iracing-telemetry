import {
  Badge,
  Link,
  Navbar,
  NavbarContent,
  NavbarItem,
  Switch,
  Tooltip
} from '@nextui-org/react';
import { useContext } from 'react';
import { SocketContext } from '~/store/socket.context';

import { Activity, Moon, Sun } from 'react-feather';
import { Theme, useTheme } from 'remix-themes';

export default function Navigation() {
  const { isConnected } = useContext(SocketContext);
  const [theme, setTheme] = useTheme();

  return (
    <Navbar isBordered maxWidth="full">
      <NavbarContent className="gap-4 w-full flex flex-row items-center">
        <NavbarItem>
          <Link href="/dashboard">Dashboard</Link>
        </NavbarItem>
        <NavbarItem>
          <Badge content="Coming soon!" color="warning">
            <Link isDisabled href="/dashboard/telemetry">
              Telemetry
            </Link>
          </Badge>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Badge
            placement="top-left"
            content={''}
            color={isConnected ? 'success' : 'danger'}
          >
            <Tooltip
              content={`${
                isConnected ? 'Connected to the' : 'Disconnected from the '
              } telemetry server`}
            >
              <div>{isConnected ? <Activity /> : <Activity />}</div>
            </Tooltip>
          </Badge>
        </NavbarItem>
        <NavbarItem>
          <Switch
            onChange={() =>
              setTheme(theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT)
            }
            defaultSelected={theme === Theme.LIGHT}
            startContent={<Sun />}
            endContent={<Moon />}
          />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}
