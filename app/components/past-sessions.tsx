import { Divider, Pagination, Spinner } from '@nextui-org/react';
import {
  FetcherWithComponents,
  useFetcher,
  useNavigate
} from '@remix-run/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import SessionFilter from '~/components/session.filter';
import SessionTable from '~/components/sessions.table';
import { action } from '~/routes/session-search';
import { TelemetrySession } from '~/shared/types';
import { debounce } from '~/utils/debounce';

type IProps = {
  previousSessions: TelemetrySession[];
};

export default function PastSessions({ previousSessions }: IProps) {
  const ref = useRef<HTMLInputElement | null>(null);
  const [historicalSessions, setSessions] = useState<TelemetrySession[]>(
    (previousSessions as TelemetrySession[]) ?? []
  );

  const fetcher = useFetcher<typeof action>();

  useEffect(() => {
    if (fetcher.data?.data) {
      setSessions(fetcher.data?.data as TelemetrySession[]);
    }
  }, [fetcher.state]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    // const timeout = debounce(() => {
    //   fetcher.submit(e.target.form);
    // }, 0.5);
    let timeout;
    if (ref.current?.value.length && ref.current.value.length > 2) {
      timeout = debounce(() => {
        fetcher.submit(e.target.form);
      }, 0.5);
    }

    if (!ref.current?.value.length) {
      clearTimeout(timeout);
      setSessions(previousSessions);
    }
  };

  const onClear = () => {
    ref.current?.form?.reset();
  };

  const navigate = useNavigate();
  return (
    <section className="my-2">
      <SessionTable
        tableProps={{
          topContent: (
            <SessionFilter
              ref={ref}
              onClear={onClear}
              currentValue={ref.current?.value}
              fetcher={fetcher as FetcherWithComponents<typeof action>}
              handleChange={handleSearch}
            />
          ),
          selectionMode: 'single',
          onRowAction: (id) => navigate(`/dashboard/${id}/telemetry`),
          classNames: {
            wrapper: 'min-h-[400px]'
          },
          bottomContent: (
            <div className="flex flex-col gap-2">
              <Divider />
              <div className="flex w-full justify-center">
                <Pagination isDisabled isCompact page={1} total={1} />
              </div>
            </div>
          )
        }}
        sessions={historicalSessions}
        bodyProps={{
          loadingContent: <Spinner />,
          isLoading:
            fetcher.state === 'loading' || fetcher.state === 'submitting',
          emptyContent: 'No session data available.'
        }}
      />
    </section>
  );
}
