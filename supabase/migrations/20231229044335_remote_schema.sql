create table "public"."telemetry" (
    "id" uuid not null default gen_random_uuid(),
    "sessionId" uuid not null,
    "data" jsonb not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."telemetry" enable row level security;

CREATE UNIQUE INDEX telemetry_pkey ON public.telemetry USING btree (id);

alter table "public"."telemetry" add constraint "telemetry_pkey" PRIMARY KEY using index "telemetry_pkey";

alter table "public"."telemetry" add constraint "telemetry_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES sessions(id) ON DELETE CASCADE not valid;

alter table "public"."telemetry" validate constraint "telemetry_sessionId_fkey";


