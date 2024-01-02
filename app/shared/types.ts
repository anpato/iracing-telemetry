import { SupabaseClient } from '@supabase/auth-helpers-remix';
import { Database } from '~/shared/db';

export type Platform = 'desktop' | 'web';

export type OutletContext = {
  supabase: SupabaseClient;
};

type SessionMetadata = {
  carInfo: {
    id: number;
    name: string;
    path: string;
  };
  SimMode: string;
  TrackID: number;
  Category: string;
  LeagueID: number;
  Official: number;
  RaceWeek: number;
  SeasonID: number;
  SeriesID: number;
  BuildType: string;
  DCRuleSet: string;
  EventType: string;
  SessionID: number;
  TrackCity: string;
  TrackName: string;
  TrackType: string;
  HeatRacing: number;
  MaxDrivers: number;
  MinDrivers: number;
  SessionNum: number;
  TeamRacing: number;
  TrackSkies: string;
  BuildTarget: string;
  NumCarTypes: number;
  SessionLaps: string;
  SessionName: string;
  SessionTime: string;
  SessionType: string;
  TrackLength: string;
  BuildVersion: string;
  SubSessionID: number;
  TrackAirTemp: string;
  TrackCleanup: number;
  TrackCountry: string;
  TrackVersion: string;
  TrackWindDir: string;
  TrackWindVel: string;
  NumCarClasses: number;
  TrackAltitude: string;
  TrackFogLevel: string;
  TrackLatitude: string;
  TrackNumTurns: number;
  SessionSkipped: number;
  SessionSubType: null;
  TrackDirection: string;
  TrackLongitude: string;
  WeekendOptions: [];
  ResultsOfficial: number;
  TrackConfigName: null;
  ResultsPositions: {
    CarIdx: number;
    ClassPosition: number;
    FastestLap: number;
    FastestTime: number;
    Incidents: number;
    JokerLapsComplete: number;
    Lap: number;
    LapsComplete: number;
    LapsDriven: number;
    LapsLed: number;
    LastTime: number;
    Position: number;
    ReasonOutId: number;
    ReasonOutStr: string;
    Time: number;
  };
  TrackAirPressure: string;
  TrackDisplayName: string;
  TrackNorthOffset: string;
  TrackSurfaceTemp: string;
  TrackWeatherType: string;
  ResultsFastestLap: [];
  TrackDynamicTrack: number;
  TrackPitSpeedLimit: string;
  TrackPrecipitation: string;
  ResultsLapsComplete: number;
  SessionNumLapsToAvg: number;
  TrackLengthOfficial: string;
  SessionRunGroupsUsed: number;
  ResultsAverageLapTime: number;
  ResultsNumCautionLaps: number;
  ResultsNumLeadChanges: number;
  TrackDisplayShortName: string;
  TrackRelativeHumidity: string;
  QualifierMustStartRace: number;
  ResultsNumCautionFlags: number;
  SessionTrackRubberState: string;
  SessionEnforceTireCompoundChange: number;
};

export type TelemetrySession = Omit<
  Database['public']['Tables']['sessions']['Row'],
  'metdata'
> & {
  tracks?: Database['public']['Tables']['tracks']['Row'] | undefined;
} & { metadata: SessionMetadata | undefined };
