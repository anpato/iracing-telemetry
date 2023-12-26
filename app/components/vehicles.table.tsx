import {
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow
} from '@nextui-org/react';
import { FC } from 'react';

type IProps = {
  mostUsedVehicles: any[];
};

const VehicleTable: FC<IProps> = ({ mostUsedVehicles }) => {
  return (
    <Table shadow="none">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No data available">
        {mostUsedVehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>
              <p className="font-medium">{vehicle.name}</p>
            </TableCell>
            <TableCell>
              <Link
                showAnchorIcon
                isDisabled
                href={`/sessions/vehicles/${vehicle.id}`}
              >
                View Sessions
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default VehicleTable;
