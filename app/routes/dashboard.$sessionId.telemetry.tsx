import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { getAuthorizedSession, supabaseServer } from '~/utils/supabase.server';
import { TelemetryVarList } from '@irsdk-node/types';
import { useLoaderData, useNavigation } from '@remix-run/react';
import { Code, Divider, Select, SelectItem } from '@nextui-org/react';
import { HelperService } from '~/utils/helpers';
import { useState } from 'react';
import ChartCard from '~/components/chart-card';
import { LapMapping } from '~/shared/chart.types';
import { RaceSession } from '~/shared/types';
import { basicChartOptions } from '~/shared/constants';

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { client, response } = supabaseServer(request);
  const { sessionId } = params;
  if (!sessionId) {
    return redirect('/dashboard');
  }

  const session = await getAuthorizedSession(client);
  if (!session) {
    return redirect('/', { status: 401 });
  }

  const { data: ses } = await client
    .from('sessions')
    .select('*, telemetry(*), tracks(*)')
    .eq('id', sessionId)
    .single();

  const { telemetry, ...rest } = ses as unknown as RaceSession;

  return json(
    {
      session: rest,
      telemetry: (telemetry[0]?.data as unknown as TelemetryVarList[]) ?? []
    },
    { headers: response.headers }
  );
};

type varListKeys = keyof TelemetryVarList;
const calculateSums = (
  tel: TelemetryVarList,
  keys: varListKeys[]
): number | string => {
  return (
    keys.reduce((ac, k) => {
      if (typeof tel[k].value[0] === 'boolean') {
        ac += tel[k].value ? 100 : 0;
      }
      if (typeof tel[k].value[0] === 'number') {
        ac += tel[k].value[0] as number;
      }

      return ac;
    }, 0) / keys.length
  );
};

export default function SessionTelemetry() {
  const { telemetry, session } = useLoaderData<typeof loader>();
  const [selectedLap, setSelected] = useState<number>(0);
  const lapMapping: LapMapping = new Map();

  const navigation = useNavigation();

  telemetry.forEach((t: TelemetryVarList) => {
    const key = t.Lap.value[0] + 1;
    const existing = lapMapping.get(key);

    const existingValues = existing?.values ?? [];
    lapMapping.set(key, {
      laptime: HelperService.convertToLapTime(t.LapCurrentLapTime.value[0]),
      values: [
        ...existingValues,
        {
          speed: (t.Speed.value[0] * 2.237).toFixed(2),
          abs: t.BrakeABSactive.value[0] ? 100 : 0,
          gear: t.Gear.value[0],
          tw: 0,
          tt: calculateSums(t, [
            'RFtempCL',
            'RFtempCM',
            'RFtempCR',
            'LFtempCL',
            'LFtempCM',
            'LFtempCR',
            'RRtempCL',
            'RRtempCM',
            'RRtempCR',
            'LRtempCL',
            'LRtempCM',
            'LRtempCR'
          ]),

          brk: Math.round(t.BrakeRaw.value[0] * 100),
          thrtl: Math.round(t.ThrottleRaw.value[0] * 100),
          wangle: parseFloat(
            (t.SteeringWheelAngle.value[0] * 100).toString()
          ).toFixed(2),
          rpm: Math.round(t.RPM.value[0]) / 100
        }
      ]
    });
  });

  const selectionItems = [...lapMapping.keys()].map((k) => ({
    label: `Lap ${k}`,
    value: k
  }));

  return (
    <div className="px-2">
      <div className="flex flex-row gap-2 justify-between my-2 items-center">
        <div className="flex gap-2 flex-col">
          <h3>
            <Code color="success">{session.tracks?.trackName}</Code>
          </h3>
          <h6>
            <Code color="secondary">{session.metadata.carInfo.name}</Code>
          </h6>
        </div>
        <Select
          variant="bordered"
          size="sm"
          fullWidth={false}
          className="max-w-[25%]"
          placeholder="All"
          items={[{ label: 'All laps', value: 0 }, ...selectionItems]}
          value={selectedLap}
          label="Select a lap"
          onChange={(e) => setSelected(Number(e.target.value))}
        >
          {(lap) => (
            <SelectItem key={lap.value} value={lap.value}>
              {lap.label}
            </SelectItem>
          )}
        </Select>
      </div>

      <Divider className="my-4" />

      <ChartCard
        chartOptions={basicChartOptions}
        isLoading={navigation.state === 'loading'}
        lap={selectedLap}
        lapMapping={lapMapping}
      />

      {/* <ChartCard /> */}
    </div>
  );
}
