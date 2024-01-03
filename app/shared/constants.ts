import { ChartOptions } from '~/shared/chart.types';

export const basicChartOptions: ChartOptions[] = [
  {
    name: 'Brake %',
    label: 'Brake',
    datakey: 'brk',
    stroke: '#F54180',
    unit: '%'
  },
  { name: 'Throttle %', label: 'Throttle', datakey: 'thrtl', unit: '%' },
  {
    name: 'Gear',
    label: 'Gear Selected',
    unit: '',
    stroke: '#f5a524',
    datakey: 'gear'
  },
  {
    name: 'Wheel Angle',
    label: 'Steering Angle',
    unit: '°',
    datakey: 'wangle',
    stroke: '#7EE7FC'
  },
  { name: 'Rpm', label: 'Rpm', datakey: 'rpm', stroke: '#9353d3' },
  { name: 'Speed', label: 'Speed', datakey: 'speed', unit: 'mph' }
];
