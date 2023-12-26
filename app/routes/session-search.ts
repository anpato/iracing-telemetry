import { ActionFunctionArgs, json } from '@remix-run/node';
import { getValidatedFormData } from 'remix-hook-form';
import { SearchSchema, type SearchFormData } from '~/shared/schema';

export async function action({ request }: ActionFunctionArgs) {
  const { errors, data, receivedValues } =
    await getValidatedFormData<SearchFormData>(
      request,
      SearchSchema.resolver()
    );

  if (errors) {
    return json({
      errors,
      receivedValues
    });
  }

  // TODO: Return search results
  return json({
    data
  });
}
