import {
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  CheckboxGroup,
  Code,
  Spinner
} from '@nextui-org/react';
import { FC, useState } from 'react';
import { Theme, useTheme } from 'remix-themes';
import { LapMapping, ChartOptions } from '~/shared/chart.types';
import { AxisDomain } from 'recharts/types/util/types';

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

  const chartData =
    lap === 0
      ? [...lapMapping.keys()].flatMap((k) => lapMapping.get(k)?.values)
      : lapMapping.get(lap)?.values;
  const domainOptions = (): AxisDomain => {
    if (selectedValues.includes('wangle')) {
      return [-360, 360];
    }
    if (selectedValues.includes('speed')) {
      return [0, 300];
    }
    return ['dataMin', 'dataMax'];
  };
  return (
    <Card className="min-h-[300px]">
      <CardHeader className="flex flex-row justify-between">
        <div>
          Laptime: <Code>{!lap ? 'N/A' : lapMapping.get(lap)?.laptime}</Code>
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
            <LineChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis includeHidden={false} domain={domainOptions()} />

              <Tooltip
                contentStyle={toolTipStyle}
                wrapperStyle={toolTipStyle}
                itemStyle={toolTipStyle}
              />
              <Legend />
              {chartOptions.map((ch) => (
                <Line
                  key={ch.datakey}
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

export default ChartCard;
