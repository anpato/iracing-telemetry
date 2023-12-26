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
import { FC } from 'react';

type IProps<T> = {
  sessions: any[];
  bodyProps?: Omit<TableBodyProps<T>, 'children'>;
  tableProps?: TableProps;
};

const SessionTable: FC<IProps<any>> = ({
  sessions,
  tableProps = {},
  bodyProps = {}
}) => {
  return (
    <Table {...tableProps}>
      <TableHeader>
        <TableColumn>Track</TableColumn>
        <TableColumn>Average Laptime</TableColumn>
        <TableColumn>Fastest Lap</TableColumn>
      </TableHeader>
      <TableBody {...bodyProps}>
        {sessions.map((session) => (
          <TableRow key={session.id}>
            <TableCell>
              <p className="font-medium">{session.track}</p>
            </TableCell>
            <TableCell>
              <Code color="warning">{session.averageLaptime}</Code>
            </TableCell>
            <TableCell>
              <Code color="success">{session.fastestLaptime}</Code>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default SessionTable;
