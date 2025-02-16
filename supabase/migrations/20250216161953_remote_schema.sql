revoke delete on table "public"."links" from "anon";

revoke insert on table "public"."links" from "anon";

revoke references on table "public"."links" from "anon";

revoke trigger on table "public"."links" from "anon";

revoke truncate on table "public"."links" from "anon";

revoke update on table "public"."links" from "anon";

revoke delete on table "public"."links" from "authenticated";

revoke references on table "public"."links" from "authenticated";

revoke trigger on table "public"."links" from "authenticated";

revoke truncate on table "public"."links" from "authenticated";

create table "public"."user_added_links" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "link_id" uuid not null,
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."user_added_links" enable row level security;

CREATE UNIQUE INDEX user_added_links_link_id_key ON public.user_added_links USING btree (link_id);

CREATE UNIQUE INDEX user_added_links_pkey ON public.user_added_links USING btree (id);

alter table "public"."user_added_links" add constraint "user_added_links_pkey" PRIMARY KEY using index "user_added_links_pkey";

alter table "public"."user_added_links" add constraint "fk_link" FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE not valid;

alter table "public"."user_added_links" validate constraint "fk_link";

alter table "public"."user_added_links" add constraint "fk_user" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."user_added_links" validate constraint "fk_user";

alter table "public"."user_added_links" add constraint "user_added_links_link_id_key" UNIQUE using index "user_added_links_link_id_key";

grant delete on table "public"."user_added_links" to "anon";

grant insert on table "public"."user_added_links" to "anon";

grant references on table "public"."user_added_links" to "anon";

grant select on table "public"."user_added_links" to "anon";

grant trigger on table "public"."user_added_links" to "anon";

grant truncate on table "public"."user_added_links" to "anon";

grant update on table "public"."user_added_links" to "anon";

grant delete on table "public"."user_added_links" to "authenticated";

grant insert on table "public"."user_added_links" to "authenticated";

grant references on table "public"."user_added_links" to "authenticated";

grant select on table "public"."user_added_links" to "authenticated";

grant trigger on table "public"."user_added_links" to "authenticated";

grant truncate on table "public"."user_added_links" to "authenticated";

grant update on table "public"."user_added_links" to "authenticated";

grant delete on table "public"."user_added_links" to "service_role";

grant insert on table "public"."user_added_links" to "service_role";

grant references on table "public"."user_added_links" to "service_role";

grant select on table "public"."user_added_links" to "service_role";

grant trigger on table "public"."user_added_links" to "service_role";

grant truncate on table "public"."user_added_links" to "service_role";

grant update on table "public"."user_added_links" to "service_role";

create policy "insert_links_policy"
on "public"."links"
as permissive
for insert
to public
with check ((auth.uid() IS NOT NULL));


create policy "update_links_policy"
on "public"."links"
as permissive
for update
to public
using ((auth.uid() IS NOT NULL));


create policy "Allow authenticated select"
on "public"."user_added_links"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Allow delete for own record"
on "public"."user_added_links"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert for own record"
on "public"."user_added_links"
as permissive
for insert
to public
with check ((user_id = auth.uid()));


create policy "Allow update for own record"
on "public"."user_added_links"
as permissive
for update
to public
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



