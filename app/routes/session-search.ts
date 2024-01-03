import { ActionFunctionArgs, json } from '@remix-run/node';
import { getValidatedFormData } from 'remix-hook-form';
import { SearchSchema, type SearchFormData } from '~/shared/schema';
import { supabaseServer } from '~/utils/supabase.server';

export async function action({ request }: ActionFunctionArgs) {
  const { client, response } = supabaseServer(request);
  const { errors, data, receivedValues } =
    await getValidatedFormData<SearchFormData>(
      request,
      SearchSchema.resolver()
    );

  if (errors) {
    return json(
      {
        data: [],
        errors,
        receivedValues
      },
      { headers: response.headers }
    );
  }
  const { data: tracks } = await client
    .from('tracks')
    .select()
    .ilike('trackName', `%${data.query}%`);

  const { data: results, error } = await client
    .from('sessions')
    .select(`*, tracks(*)`)
    .or(
      `track_id.in.(${tracks
        ?.map((t) => t.id)
        .join(',')}), metadata->carInfo->>name.ilike.%${data.query}%`
    );

  return json({
    data: results ?? []
  });
}
