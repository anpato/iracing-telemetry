import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { StatusCodes } from 'http-status-codes';
import { getSessions } from '~/shared/queries';
import { CarList, TelemetrySession } from '~/shared/types';
import { supabaseServer, getAuthorizedSession } from '~/utils/supabase.server';

export const dashboardIndex = async ({ request }: LoaderFunctionArgs) => {
  const { client, response } = supabaseServer(request);
  const session = await getAuthorizedSession(client);

  if (!session) {
    return redirect('/', { status: StatusCodes.UNAUTHORIZED });
  }
  const { data, error } = await getSessions(client, session);
  const carMap: Record<string, number> = {};

  data?.forEach((ses) => {
    const car = ses.metadata.carInfo.name;
    if (carMap[car]) {
      carMap[car] = carMap[car] + 1;
    } else {
      carMap[car] = 1;
    }
  });

  const mostUsed = Object.keys(carMap)
    .map((k) => ({
      count: carMap[k],
      ...(data?.find((ses) => ses.metadata.carInfo.name === k)?.metadata
        .carInfo ?? {})
    }))
    .sort((a, b) => b.count - a.count)
    .splice(0, 4);

  return json(
    {
      sessions: data,
      mostUsedVehicles: mostUsed as CarList[],
      previousSessions: (data?.slice(0, 3) as TelemetrySession[]) ?? []
    },
    { headers: response.headers }
  );
};

export const getSessionsByVehicle = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const carId = url.searchParams.get('car');
  const { client, response } = supabaseServer(request);
  const { data, error } = await client
    .from('sessions')
    .select('*, tracks(*)')
    .eq('metadata->carInfo->>id', carId as string)
    .order('created_at', { ascending: false });

  return json(
    {
      sessions: (data as TelemetrySession[]) ?? ([] as TelemetrySession[])
    },
    { headers: response.headers }
  );
};
