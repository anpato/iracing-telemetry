import { TelemetryVarList } from '@irsdk-node/types';
import {
  Button,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Tooltip
} from '@nextui-org/react';
import { useNavigate, useOutletContext } from '@remix-run/react';
import { SupabaseClient } from '@supabase/supabase-js';
import { useContext, useEffect, useState } from 'react';
import ChartCard from '~/components/chart-card';
import navigation from '~/components/navigation';
import { varListKeys } from '~/routes/dashboard.$sessionId.telemetry';
import { LapMapping } from '~/shared/chart.types';
import { basicChartOptions } from '~/shared/constants';
import { Database } from '~/shared/db';
import { TelemetrySession } from '~/shared/types';
import SocketProvider, { SocketContext } from '~/store/socket.context';
import { HelperService } from '~/utils/helpers';

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

export default function Telemetry() {
  const { isConnected, socket } = useContext(SocketContext);
  const [session, setSession] = useState<{
    session: TelemetrySession;
    track: TelemetrySession['tracks'];
  }>();
  const [telemetry, setTelemetry] = useState<TelemetryVarList[]>([]);

  useEffect(() => {
    if (!session) {
      socket?.on('session', (data) => {
        console.log('Session', data);
        setSession(JSON.parse(data));
      });
    }

    socket?.on('telemetry', (data) => {
      console.log('Telemetr', data);
      setTelemetry([...telemetry, ...data.data]);
      if (telemetry.length > 200) {
        const copy = telemetry.filter((t, i) => i > 199);
        console.log(copy.length);
      }
    });
  }, [socket, session]);

  const lapMapping: LapMapping = new Map();

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

  const navigate = useNavigate();
  return (
    <div>
      <Modal
        hideCloseButton
        isDismissable={false}
        backdrop="blur"
        isOpen={!session || !telemetry}
      >
        <ModalContent>
          <ModalHeader>Waiting for data</ModalHeader>
          <ModalBody>
            <Spinner size="md" />
          </ModalBody>
          <ModalFooter>
            <div>
              <Tooltip content="Go back to your dashboard">
                <Button
                  as={Link}
                  href="/dashboard"
                  color="danger"
                  fullWidth
                  variant="solid"
                >
                  Cancel
                </Button>
              </Tooltip>
              <Divider className="my-2" />
              <p className="prose">
                By cancelling we'll disconnect you from your session and
                redirect you to your dashboard.
              </p>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <h3>{session?.track?.trackName}</h3>
      <h4>{session?.session.metadata.carInfo.name}</h4>
      <ChartCard
        chartOptions={basicChartOptions}
        isLoading={!session || !telemetry}
        lap={0}
        lapMapping={lapMapping}
      />
    </div>
  );
}
