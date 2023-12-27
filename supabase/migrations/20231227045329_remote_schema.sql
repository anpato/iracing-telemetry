CREATE UNIQUE INDEX user_infos_iracing_member_id_key ON public.user_infos USING btree (iracing_member_id);

alter table "public"."user_infos" add constraint "user_infos_iracing_member_id_key" UNIQUE using index "user_infos_iracing_member_id_key";

create policy "Enable delete for users based on user_id"
on "public"."user_infos"
as permissive
for delete
to authenticated
using ((auth.uid() = user_id));


create policy "Enable insert for anon role"
on "public"."user_infos"
as permissive
for insert
to anon
with check (false);


create policy "Enable insert to user info as authenticated"
on "public"."user_infos"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable update for users based on user_id"
on "public"."user_infos"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



