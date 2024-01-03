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
import { useLocation } from '@remix-run/react';
import { FC } from 'react';
import { CarList } from '~/shared/types';

type IProps = {
  mostUsedVehicles: CarList[];
};

const VehicleTable: FC<IProps> = ({ mostUsedVehicles }) => {
  const location = useLocation();
  return (
    <Table shadow="none">
      <TableHeader>
        <TableColumn>Name</TableColumn>
        <TableColumn>Actions</TableColumn>
      </TableHeader>
      <TableBody emptyContent="No data available">
        {mostUsedVehicles?.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>
              <p className="font-medium">{vehicle.name}</p>
            </TableCell>
            <TableCell>
              <Link
                showAnchorIcon
                href={`${location.pathname}?car=${vehicle.id}`}
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
