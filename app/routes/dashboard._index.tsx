import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Pagination
} from '@nextui-org/react';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import SessionTable from '~/components/sessions.table';
import VehicleTable from '~/components/vehicles.table';
import SessionFilter from '~/components/session.filter';

export async function loader() {
  return json({
    sessions: [{}],
    mostUsedVehicles: [
      { name: 'BMW M4 GT3', id: '1234' },
      { name: 'Porsche 963 GTP', id: '12' }
    ],
    previousSessions: [
      {
        track: 'Red Bull Ring',
        fastestLaptime: '1.27.03',
        averageLaptime: '1.27.65',
        id: '1234567'
      }
    ]
  });
}

export default function Dashview() {
  const { previousSessions, mostUsedVehicles } = useLoaderData<typeof loader>();
  return (
    <div className="">
      <section className="grid grid-cols-2 gap-3 px-2 py-4">
        <Card shadow="sm">
          <CardHeader className="pb-0 pt-2 px-4">
            <h4 className="font-bold text-large">Last 5 sessions</h4>
          </CardHeader>
          <CardBody className="py-2">
            <SessionTable
              tableProps={{ shadow: 'none' }}
              bodyProps={{ emptyContent: 'No data available.' }}
              sessions={previousSessions}
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
            topContent: <SessionFilter />,
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
          sessions={[]}
          bodyProps={{ emptyContent: 'No session data available.' }}
        />
      </section>
    </div>
  );
}
