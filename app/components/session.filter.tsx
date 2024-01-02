import { Input } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { ChangeEvent, FC, useEffect, useRef } from 'react';
import { debounce } from '~/utils/debounce';
import { useRemixForm } from 'remix-hook-form';
import { SearchFormData, SearchSchema } from '~/shared/schema';
import { TelemetrySession } from '~/shared/types';
import { action } from '~/routes/session-search';

type IProps = {
  setSessions: (values: TelemetrySession[]) => void;
};

const SessionFilter: FC<IProps> = ({ setSessions }) => {
  const ref = useRef<HTMLInputElement | null>(null);

  const fetcher = useFetcher<typeof action>();
  const {
    formState: { errors },
    register
  } = useRemixForm<SearchFormData>({
    fetcher,
    resolver: SearchSchema.resolver()
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(() => {
      fetcher.submit(e.target.form);
    }, 0.5);
  };

  useEffect(() => {
    if (fetcher.state === 'submitting') {
      setSessions(fetcher?.data?.data ? [...fetcher.data?.data] : []);
    }
  }, [fetcher.data]);

  return (
    <div>
      <fetcher.Form method="post" action="/session-search">
        <Input
          {...register('query', {
            onChange: handleChange
          })}
          onClear={() => ref.current?.form?.reset()}
          ref={ref}
          variant="bordered"
          description="Ex: Red bull ring, Bmw"
          isClearable
          isInvalid={!!errors?.query && ref.current?.value.length !== 0}
          errorMessage={
            errors?.query &&
            (errors?.query?.message as string) &&
            ref.current?.value.length
          }
          type="text"
          name="query"
          label="Search sessions"
        />
      </fetcher.Form>
    </div>
  );
};

export default SessionFilter;
