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
        errors,
        receivedValues
      },
      { headers: response.headers }
    );
  }

  const { data: results } = await client
    .from('sessions')
    .select('*, tracks(*)')
    .ilike('tracks.trackName', data.query);
  console.log(results);
  const { data: tracks } = await client
    .from('tracks')
    .select()
    .in('id', results?.map((r) => r.track_id) ?? []);
  // TODO: Return search results
  if (tracks?.length) {
    return json({
      data: results?.map((r) => ({
        ...r,
        tracks: tracks.find((t) => t.id === r.track_id)
      }))
    });
  }
  return json({
    data: []
  });
}
