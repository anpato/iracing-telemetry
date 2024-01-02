alter table "public"."user_sessions" drop constraint "user_sessions_user_id_fkey";

alter table "public"."user_sessions" drop constraint "user_sessions_pkey";

drop index if exists "public"."user_sessions_pkey";

drop table "public"."user_sessions";

create table "public"."sessions" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "user_id" uuid not null,
    "track_id" uuid,
    "metadata" jsonb not null
);


alter table "public"."sessions" enable row level security;

create table "public"."tracks" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "irTrackId" integer not null,
    "trackName" character varying not null
);


alter table "public"."tracks" enable row level security;

alter table "public"."user_infos" add column "meta" jsonb;

CREATE UNIQUE INDEX sessions_pkey ON public.sessions USING btree (id);

CREATE UNIQUE INDEX tracks_pkey ON public.tracks USING btree (id);

alter table "public"."sessions" add constraint "sessions_pkey" PRIMARY KEY using index "sessions_pkey";

alter table "public"."tracks" add constraint "tracks_pkey" PRIMARY KEY using index "tracks_pkey";

alter table "public"."sessions" add constraint "sessions_track_id_fkey" FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_track_id_fkey";

alter table "public"."sessions" add constraint "sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_user_id_fkey";


