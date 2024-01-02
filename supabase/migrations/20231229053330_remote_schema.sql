CREATE UNIQUE INDEX "tracks_irTrackId_key" ON public.tracks USING btree ("irTrackId");

alter table "public"."tracks" add constraint "tracks_irTrackId_key" UNIQUE using index "tracks_irTrackId_key";


