import { Input } from '@nextui-org/react';
import { useFetcher } from '@remix-run/react';
import { ChangeEvent, useRef } from 'react';
import { debounce } from '~/utils/debounce';
import { useRemixForm } from 'remix-hook-form';
import { SearchFormData, SearchSchema } from '~/shared/schema';

const SessionFilter = () => {
  const ref = useRef<HTMLInputElement | null>(null);

  const fetcher = useFetcher();
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
          isInvalid={!!errors?.query}
          errorMessage={errors?.query && (errors?.query?.message as string)}
          type="text"
          name="query"
          label="Search sessions"
        />
      </fetcher.Form>
    </div>
  );
};

export default SessionFilter;
