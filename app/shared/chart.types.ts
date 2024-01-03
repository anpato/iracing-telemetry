export type ChartOptions = {
  name: string;
  label: string;
  datakey: string;
  stroke?: string;
  unit?: string;
};

export type RawValues = Record<
  'brk' | 'thrtl' | 'wangle' | 'rpm' | 'gear' | 'abs' | 'tw' | 'tt' | 'speed',
  string | number
>;

export type LapMapping = Map<
  number,
  {
    laptime: string;
    values: RawValues[];
  }
>;
