import { LoaderFunctionArgs, json, redirect } from '@remix-run/node';
import { getAuthorizedSession, supabaseServer } from '~/utils/supabase.server';
import { TelemetryVarList } from '@irsdk-node/types';
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useNavigation
} from '@remix-run/react';
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Code,
  Spinner,
  Tab,
  Tabs
} from '@nextui-org/react';
import { HelperService } from '~/utils/helpers';
import { FC, useEffect, useState } from 'react';
import { Theme, useTheme } from 'remix-themes';

type ChartOptions = {
  name: string;
  label: string;
  datakey: string;
  stroke?: string;
  unit?: string;
};

type RawValues = Record<
  'brk' | 'thrtl' | 'wangle' | 'rpm' | 'rftw' | 'rftt',
  string | number
>;

type LapMapping = Map<
  number,
  {
    laptime: string;
    values: RawValues[];
  }
>;

type ChartProps = {
  lapMapping: LapMapping;
  lap: number;
  isLoading: boolean;
  chartOptions: ChartOptions[];
};

const ChartCard: FC<ChartProps> = ({
  lapMapping,
  lap,
  isLoading = false,
  chartOptions
}) => {
  const [selectedValues, setSelected] = useState<string[]>(['thrtl', 'brk']);
  const [theme] = useTheme();

  const toolTipStyle = {
    backgroundColor: theme === Theme.DARK ? '#000000' : '#FFFFFF'
  };

  return (
    <Card className="min-h-[300px]">
      <CardHeader className="flex flex-row justify-between">
        <div>
          Laptime: <Code>{lapMapping.get(lap)?.laptime}</Code>
        </div>
        <CheckboxGroup
          value={selectedValues}
          onValueChange={setSelected}
          orientation="horizontal"
          defaultValue={['thrtl', 'brk']}
        >
          {chartOptions.map((ch) => (
            <Checkbox value={ch.datakey}>{ch.label}</Checkbox>
          ))}
        </CheckboxGroup>
      </CardHeader>
      <CardBody>
        {isLoading ? (
          <Spinner />
        ) : (
          <ResponsiveContainer width="100%" height={600}>
            <LineChart data={lapMapping.get(lap)?.values}>
              <XAxis dataKey="name" />
              <YAxis includeHidden={false} />
              <Tooltip
                contentStyle={toolTipStyle}
                wrapperStyle={toolTipStyle}
                itemStyle={toolTipStyle}
              />
              <Legend />
              {chartOptions.map((ch) => (
                <Line
                  hide={!selectedValues.includes(ch.datakey)}
                  name={ch.label}
                  unit={ch?.unit}
                  type="monotone"
                  dataKey={ch.datakey}
                  dot={false}
                  stroke={ch.stroke}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};

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

  const { data, error } = await client
    .from('telemetry')
    .select()
    .eq('sessionId', sessionId as string)
    .single();

  return json(
    {
      telemetry: data?.data as unknown as TelemetryVarList[]
    },
    { headers: response.headers }
  );
};

const chartOptions: ChartOptions[] = [
  {
    name: 'Brake %',
    label: 'Brake',
    datakey: 'brk',
    stroke: '#F54180',
    unit: '%'
  },
  { name: 'Throttle %', label: 'Throttle', datakey: 'thrtl', unit: '%' },
  {
    name: 'Wheel Angle',
    label: 'Wheel Angle',
    unit: '°',
    datakey: 'wangle',
    stroke: '#F7B750'
  },
  { name: 'Rpm', label: 'Rpm', datakey: 'rpm', stroke: '#9353d3' },
  {
    name: 'Right Front Tire Wear',
    label: 'RF Tire Wear',
    datakey: 'rftw',
    stroke: '#9353d3'
  },
  {
    name: 'Right Front Tire Temperature',
    label: 'RF Tire Temp',
    unit: '°',
    datakey: 'rftt'
  }
];

export default function SessionTelemetry() {
  const { telemetry } = useLoaderData<typeof loader>();

  const lapMapping: LapMapping = new Map();
  const location = useLocation();
  const navigation = useNavigation();
  const navigate = useNavigate();

  telemetry.forEach((t) => {
    const existing = lapMapping.get(t.Lap.value[0]);
    const key = t.Lap.value[0];
    const existingValues = existing?.values ?? [];
    lapMapping.set(key, {
      laptime: HelperService.convertToLapTime(t.LapCurrentLapTime.value[0]),
      values: [
        ...existingValues,
        {
          rftt: Math.round(
            t.RFtempCL.value[0] + t.RFtempCM.value[0] + t.RFtempCR.value[0]
          ),
          rftw: Math.abs(
            t.RFwearL.value[0] + t.RFwearM.value[0] + t.RFwearR.value[0]
          ),
          brk: Math.round(t.Brake.value[0] * 100),
          thrtl: Math.round(t.Throttle.value[0] * 100),
          wangle: parseFloat(
            (t.SteeringWheelAngle.value[0] * 100).toString()
          ).toFixed(2),
          rpm: Math.round(t.RPM.value[0]) / 100
        }
      ]
    });
  });

  useEffect(() => {
    if (!location.search) {
      navigate(`${location.pathname}?lap=${[...lapMapping.keys()][0]}`);
    }
  }, []);

  return (
    <div className="px-2">
      <Tabs
        color="primary"
        defaultSelectedKey={`${location.pathname}?lap=${
          [...lapMapping.keys()][0]
        }`}
        selectedKey={`${location.pathname}${location.search}`}
      >
        {[...lapMapping.keys()].map((key) => (
          <Tab
            href={`${location.pathname}?lap=${key}`}
            key={`${location.pathname}?lap=${key}`}
            title={`Lap ${key}`}
          >
            <ChartCard
              chartOptions={chartOptions}
              isLoading={navigation.state === 'loading'}
              key={key}
              lap={key}
              lapMapping={lapMapping}
            />
          </Tab>
        ))}
      </Tabs>
    </div>
  );
}
