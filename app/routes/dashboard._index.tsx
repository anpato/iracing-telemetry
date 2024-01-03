import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Pagination
} from '@nextui-org/react';
import { useLoaderData, useNavigate } from '@remix-run/react';
import SessionTable from '~/components/sessions.table';
import VehicleTable from '~/components/vehicles.table';
import SessionFilter from '~/components/session.filter';
import { TelemetrySession } from '~/shared/types';
import { useState } from 'react';
import { dashboardIndex } from '~/loaders/dashboard.server';
import SessionModal from '~/components/session.modal';
import PastSessions from '~/components/past-sessions';

export { dashboardIndex as loader };

export default function Dashview() {
  const { previousSessions = [], mostUsedVehicles } =
    useLoaderData<typeof dashboardIndex>();

  const navigate = useNavigate();

  return (
    <div>
      <SessionModal mostUsedVehicles={mostUsedVehicles} />
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
      <PastSessions previousSessions={previousSessions} />
    </div>
  );
}
