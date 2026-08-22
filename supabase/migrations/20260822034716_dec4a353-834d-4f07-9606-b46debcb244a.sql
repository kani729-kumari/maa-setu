
create policy "maasetu docs read" on storage.objects for select to authenticated using (bucket_id = 'medical-documents');
create policy "maasetu docs insert" on storage.objects for insert to authenticated with check (bucket_id = 'medical-documents');
create policy "maasetu docs update" on storage.objects for update to authenticated using (bucket_id = 'medical-documents');
create policy "maasetu docs delete" on storage.objects for delete to authenticated using (bucket_id = 'medical-documents');
