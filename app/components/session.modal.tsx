import {
  Code,
  Divider,
  Listbox,
  ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner
} from '@nextui-org/react';
import { useFetcher, useNavigate, useSearchParams } from '@remix-run/react';
import { useEffect } from 'react';
import { getSessionsByVehicle } from '~/loaders/dashboard.server';
import { CarList } from '~/shared/types';

type IProps = {
  mostUsedVehicles: CarList[];
};

export default function SessionModal({ mostUsedVehicles }: IProps) {
  const fetcher = useFetcher<typeof getSessionsByVehicle>();
  const [params, setParams] = useSearchParams();
  const handleClose = () => {
    setParams('');
  };

  useEffect(() => {
    if (params.get('car')) {
      fetcher.load(`/car/sessions?car=${params.get('car')}`);
    }
  }, [params.get('car')]);

  return (
    <Modal backdrop="blur" onClose={handleClose} isOpen={!!params.get('car')}>
      <ModalContent>
        {() => {
          const carId = params.get('car');
          const vehicle = mostUsedVehicles.find(
            (veh) => veh.id.toString() === carId
          );
          return (
            <>
              <ModalHeader>{vehicle?.name}</ModalHeader>
              <Divider />
              <ModalBody>
                {fetcher.state === 'loading' && <Spinner />}
                {fetcher.data?.sessions ? (
                  <Listbox>
                    {fetcher.data?.sessions.map((ses) => (
                      <ListboxItem
                        showDivider={
                          fetcher?.data?.sessions &&
                          fetcher.data.sessions.length > 1
                        }
                        href={`/dashboard/${ses.id}/telemetry`}
                        key={ses.id}
                      >
                        <div className="flex flex-col justify-start gap-2 items-start">
                          <div className="flex flex-row gap-2">
                            <Code color="secondary">
                              {ses.tracks?.trackName}
                            </Code>
                            <Code>
                              {new Date(ses.created_at).toLocaleDateString()}
                            </Code>
                          </div>

                          <div>
                            <Code color="success">
                              {ses.metadata?.EventType}
                            </Code>
                          </div>
                        </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                ) : (
                  <p>No Sessions found</p>
                )}
              </ModalBody>
            </>
          );
        }}
      </ModalContent>
      ;
    </Modal>
  );
}
