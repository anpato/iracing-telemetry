import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Pagination
} from '@nextui-org/react';
import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import SessionTable from '~/components/sessions.table';
import VehicleTable from '~/components/vehicles.table';
import SessionFilter from '~/components/session.filter';
import { getAuthorizedSession, supabaseServer } from '~/utils/supabase.server';
import { StatusCodes } from 'http-status-codes';
import { TelemetrySession } from '~/shared/types';
import { useState } from 'react';

export async function loader({ request }: LoaderFunctionArgs) {
  const { client, response } = supabaseServer(request);
  const session = await getAuthorizedSession(client);

  if (!session) {
    return redirect('/', { status: StatusCodes.UNAUTHORIZED });
  }
  const { data, error } = await client
    .from('sessions')
    .select('*, tracks(*)')
    .eq('user_id', session?.user?.id)
    .limit(10)
    .order('created_at', { ascending: false });
  console.log(data, error);
  return json(
    {
      sessions: data,
      mostUsedVehicles: [],
      previousSessions: (data?.slice(0, 3) as TelemetrySession[]) ?? []
    },
    { headers: response.headers }
  );
}

export default function Dashview() {
  const { previousSessions = [], mostUsedVehicles } =
    useLoaderData<typeof loader>();
  const [historicalSessions, setSessions] = useState<TelemetrySession[]>(
    (previousSessions as TelemetrySession[]) ?? []
  );
  console.log(previousSessions);
  const navigate = useNavigate();

  return (
    <div className="">
      <section className="grid grid-cols-2 gap-3 px-2 py-4">
        <Card shadow="sm">
          <CardHeader className="pb-0 pt-2 px-4">
            <h4 className="font-bold text-large">Last 3 sessions</h4>
          </CardHeader>
          <CardBody className="py-2">
            <SessionTable
              tableProps={{
                shadow: 'none',
                selectionMode: 'single',
                onRowAction: (id) => navigate(`/dashboard/${id}/telemetry`)
              }}
              bodyProps={{ emptyContent: 'No data available.' }}
              sessions={previousSessions as TelemetrySession[]}
            />
          </CardBody>
        </Card>
        <Card shadow="sm">
          <CardHeader className="pb-0 pt-2 px-4">
            <h4 className="font-bold text-large">Most used cars</h4>
          </CardHeader>
          <CardBody className="py-2">
            <VehicleTable mostUsedVehicles={mostUsedVehicles} />
          </CardBody>
        </Card>
      </section>
      <Divider />
      <section className="my-2">
        <SessionTable
          tableProps={{
            topContent: <SessionFilter setSessions={setSessions} />,
            selectionMode: 'single',
            onRowAction: (id) => navigate(`/dashboard/${id}/telemetry`),
            classNames: {
              wrapper: 'min-h-[400px]'
            },
            bottomContent: (
              <div className="flex flex-col gap-2">
                <Divider />
                <div className="flex w-full justify-center">
                  <Pagination isDisabled isCompact page={1} total={1} />
                </div>
              </div>
            )
          }}
          sessions={historicalSessions}
          bodyProps={{ emptyContent: 'No session data available.' }}
        />
      </section>
    </div>
  );
}
