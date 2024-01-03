import {
  QueryData,
  QueryError,
  Session,
  SupabaseClient
} from '@supabase/supabase-js';
import { Database } from '~/shared/db';
import { TelemetrySession } from '~/shared/types';

type SessionResponse = {
  data: TelemetrySession[] | null;
  error: QueryError | null;
};

export const getSessions = async (
  client: SupabaseClient<Database>,
  session: Session
): Promise<SessionResponse> => {
  const res = await client
    .from('sessions')
    .select('*, tracks(*)')
    .eq('user_id', session?.user?.id)
    .limit(10)
    .order('created_at', { ascending: false });
  return res as SessionResponse;
};
