import { Input } from '@nextui-org/react';
import { Fetcher, FetcherWithComponents, useFetcher } from '@remix-run/react';
import {
  ChangeEvent,
  FC,
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef
} from 'react';
import { debounce } from '~/utils/debounce';
import { useRemixForm } from 'remix-hook-form';
import { SearchFormData, SearchSchema } from '~/shared/schema';
import { TelemetrySession } from '~/shared/types';
import { action } from '~/routes/session-search';

type IProps = {
  handleChange: (value: ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  currentValue: string | undefined;
  fetcher: FetcherWithComponents<typeof action>;
};

const SessionFilter: FC<IProps> = forwardRef<HTMLInputElement, IProps>(
  (
    { handleChange, fetcher, onClear, currentValue },
    ref: ForwardedRef<HTMLInputElement>
  ) => {
    const {
      formState: { errors },
      register
    } = useRemixForm<SearchFormData>({
      fetcher,
      resolver: SearchSchema.resolver()
    });
    return (
      <div>
        <fetcher.Form method="post" action="/session-search">
          <Input
            {...register('query', {
              onChange: handleChange
            })}
            onClear={onClear}
            ref={ref}
            variant="bordered"
            description="Ex: Red bull ring, Bmw"
            isClearable
            isInvalid={!!errors?.query}
            errorMessage={
              errors?.query &&
              (errors?.query?.message as string) &&
              currentValue?.length
            }
            type="text"
            name="query"
            label="Search sessions"
          />
        </fetcher.Form>
      </div>
    );
  }
);

export default SessionFilter;
