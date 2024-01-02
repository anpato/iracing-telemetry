import 'dotenv/config';
import axios from 'axios';
import fs from 'fs';
import CryptoJS from 'crypto-js';
import { createBrowserClient } from '@supabase/auth-helpers-remix';
import { Database, Json } from '~/shared/db';
import {
  DriverInfo,
  SessionData,
  SessionList,
  TelemetryVarList
} from '@irsdk-node/types';
let cookie;

type IrSdk = {
  driverInfo: DriverInfo;
  sessionInfo: SessionList;
  sessionData: SessionData;
  telemetry: TelemetryVarList;
};

const createPwHash = () => {
  var hash = CryptoJS.SHA256(
    '50Acf5b1/Subiefest13' + 'anpato1994@gmail.com'.toLowerCase()
  );
  // The values in parenthesis evaluate to ("MyPassWord"+"clunky@iracing.com")
  // Notice the password value maintains its case, while the lowercase username is used here

  //Then we need to enc the hash in Base64
  var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
  return hashInBase64;
};

const api = axios.create({
  baseURL: 'https://members-ng.iracing.com'
});

const USER__ID = '8318470d-88c0-478b-bff3-d6f337b3088b';

const supabase = createBrowserClient<Database>(
  process.env.SUPABASE_URL as string,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
);

type SbSession = {
  created_at?: string;
  id?: string;
  metadata: Json;
  track_id?: string | null;
  user_id: string;
};

type Telemetry = {
  created_at?: string;
  data: Json[];
  id?: string;
  sessionId: string;
};

type Track = {
  created_at?: string;
  id?: string;
  irTrackId: number;
  trackName: string;
};

async function run() {
  const pwHash = createPwHash();
  console.log(pwHash);
  // const res = await api.post('/auth', {
  //   email: 'anpato1994@gmail.com',
  //   password: pwHash
  // });
  // console.log(res.data);
  // const authCode = res.data.authcode;

  // const trackRes = await api.get(`/data/track?authtoken=${authCode}`, {
  //   headers: {
  //     Cookie: res.data.ssoCookieValue
  //   }
  // });
  // console.log(trackRes);

  const dir = __dirname + '/data_dump';
  const files = fs.readdirSync(dir);
  const entries: IrSdk[] = files.map((file) => require(`${dir}/${file}`));

  const dataCollections: {
    track: Track | null;
    session: SbSession | null;
    telemetry: Telemetry;
  } = {
    session: null,
    track: null,
    telemetry: {
      sessionId: '',
      data: []
    }
  };
  for (const tel of entries) {
    const { DriverCarIdx } = tel.sessionData.DriverInfo;
    const { CarID, CarScreenName, CarPath } =
      tel.driverInfo.Drivers[DriverCarIdx];
    if (!dataCollections.track)
      dataCollections.track = {
        trackName: tel.sessionData.WeekendInfo.TrackDisplayName,
        irTrackId: tel.sessionData.WeekendInfo.TrackID
      };

    if (
      !dataCollections.session &&
      entries.indexOf(tel) === entries.length - 1
    ) {
      const { TelemetryOptions, ...weekendInfo } = tel.sessionData.WeekendInfo;

      const sessionMetadata = {
        ...tel.sessionInfo.Sessions[0],
        carInfo: {
          id: CarID,
          name: CarScreenName,
          path: CarPath
        },
        ResultsPositions: tel.sessionInfo.Sessions[0].ResultsPositions.find(
          (pos: any) => pos.CarIdx === tel.driverInfo.DriverCarIdx
        ),
        ...weekendInfo
      };
      dataCollections.session = {
        track_id: '',
        user_id: USER__ID,
        metadata: sessionMetadata as unknown as Json
      };
    }

    dataCollections.telemetry.data.push(tel.telemetry as unknown as Json);
  }

  let { data: track } = await supabase
    .from('tracks')
    .select()
    .eq('irTrackId', dataCollections.track?.irTrackId as number)
    .single();
  if (!track) {
    let { data: trackCreated } = await supabase
      .from('tracks')
      .insert({ ...(dataCollections.track as Track) })
      .select()
      .single();
    if (trackCreated) {
      track = trackCreated;
    }
  }
  const { data: session, error: sError } = await supabase
    .from('sessions')
    .insert({
      ...(dataCollections.session as SbSession),
      track_id: track?.id ?? ''
    })
    .select()
    .single();

  const { data: telemetry, error } = await supabase.from('telemetry').insert({
    ...dataCollections.telemetry,
    sessionId: session?.id ?? ''
  });
  // console.error(error);
  // console.log('track',track);
  console.log('session', session, sError);
  console.log('telemetry', telemetry, error);
}

run();
