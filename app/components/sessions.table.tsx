import {
  Code,
  Table,
  TableBody,
  TableBodyProps,
  TableCell,
  TableColumn,
  TableHeader,
  TableProps,
  TableRow
} from '@nextui-org/react';
import { FC, useEffect } from 'react';
import { TelemetrySession } from '~/shared/types';

type IProps<T> = {
  sessions: TelemetrySession[];
  bodyProps?: Omit<TableBodyProps<T>, 'children'>;
  tableProps?: TableProps;
};

const SessionTable: FC<IProps<any>> = ({
  sessions,
  tableProps = {},
  bodyProps = {}
}) => {
  function convertTime(seconds: number) {
    let minutes = Number(Math.floor(seconds / 60));
    let extraSeconds = seconds % 60;
    return `${minutes}:${extraSeconds.toFixed(2)}`;
  }

  useEffect(() => {}, [sessions]);
  let tableRowProps = {};
  if (tableProps.onRowAction) {
    tableRowProps = {
      className: 'cursor-pointer'
    };
  }
  return (
    <Table {...tableProps}>
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Session Type</TableColumn>
        <TableColumn>Track</TableColumn>
        <TableColumn>Car</TableColumn>
        <TableColumn>Fastest Lap</TableColumn>
        <TableColumn>Laps</TableColumn>
      </TableHeader>
      <TableBody {...bodyProps}>
        {sessions.map((session) => (
          <TableRow key={session.id} {...tableRowProps}>
            <TableCell>
              <p className="font-medium">
                {new Date(session.created_at).toDateString()}
              </p>
            </TableCell>
            <TableCell>
              <Code
                color={
                  session.metadata.EventType === 'Practice'
                    ? 'secondary'
                    : 'primary'
                }
              >
                {session.metadata.EventType}
              </Code>
            </TableCell>
            <TableCell>
              <p className="font-medium">{session?.tracks?.trackName}</p>
            </TableCell>
            <TableCell>
              <Code color="warning">{session?.metadata?.carInfo.name}</Code>
            </TableCell>
            <TableCell>
              <Code color="success">
                {convertTime(session.metadata.ResultsPositions.FastestTime)}
              </Code>
            </TableCell>
            <TableCell>
              <Code>{session.metadata.ResultsPositions.LapsComplete}</Code>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SessionTable;
