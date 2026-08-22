
create table public.hospitals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  status text not null default 'Prototype Partner Hospital — Demonstration Only',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.hospitals to authenticated;
grant select on public.hospitals to anon;
grant all on public.hospitals to service_role;
alter table public.hospitals enable row level security;
create policy "hospitals readable" on public.hospitals for select using (true);
create policy "hospitals writable by authenticated" on public.hospitals for all to authenticated using (true) with check (true);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique,
  email text not null unique,
  full_name text not null,
  role text not null check (role in ('patient','doctor','admin')),
  phone text,
  department text,
  hospital_id uuid references public.hospitals(id),
  is_demo boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles readable by authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles writable by authenticated" on public.profiles for all to authenticated using (true) with check (true);

create table public.patients (
  id uuid primary key default gen_random_uuid(),
  mhid text not null unique,
  profile_id uuid references public.profiles(id),
  full_name text not null,
  age int not null,
  village text,
  district text,
  state text,
  blood_group text,
  pregnancy_number int not null default 1,
  lmp date,
  edd date,
  status text not null default 'active',
  emergency_contact_name text,
  emergency_contact_phone text,
  registered_at timestamptz not null default now(),
  registered_by uuid references public.profiles(id),
  hospital_id uuid references public.hospitals(id),
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.patients to authenticated;
grant all on public.patients to service_role;
alter table public.patients enable row level security;
create policy "patients readable by authenticated" on public.patients for select to authenticated using (true);
create policy "patients writable by authenticated" on public.patients for all to authenticated using (true) with check (true);

create table public.medical_records (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  record_type text not null,
  title text not null,
  summary text,
  pregnancy_month int,
  pregnancy_week int,
  recorded_at timestamptz not null default now(),
  provider_id uuid references public.profiles(id),
  provider_name text,
  hospital_name text,
  vitals jsonb not null default '{}'::jsonb,
  notes text,
  recommendations text,
  attachment_url text,
  verified boolean not null default true,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.medical_records to authenticated;
grant all on public.medical_records to service_role;
alter table public.medical_records enable row level security;
create policy "records readable by authenticated" on public.medical_records for select to authenticated using (true);
create policy "records writable by authenticated" on public.medical_records for all to authenticated using (true) with check (true);

create table public.consents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  provider_id uuid references public.profiles(id),
  provider_name text not null,
  status text not null default 'pending' check (status in ('pending','granted','denied','revoked')),
  purpose text,
  requested_at timestamptz not null default now(),
  decided_at timestamptz
);
grant select, insert, update, delete on public.consents to authenticated;
grant all on public.consents to service_role;
alter table public.consents enable row level security;
create policy "consents readable by authenticated" on public.consents for select to authenticated using (true);
create policy "consents writable by authenticated" on public.consents for all to authenticated using (true) with check (true);

create table public.access_logs (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  provider_name text not null,
  action text not null,
  reason text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.access_logs to authenticated;
grant all on public.access_logs to service_role;
alter table public.access_logs enable row level security;
create policy "logs readable by authenticated" on public.access_logs for select to authenticated using (true);
create policy "logs writable by authenticated" on public.access_logs for all to authenticated using (true) with check (true);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  title text not null,
  scheduled_at timestamptz not null,
  provider_name text,
  status text not null default 'scheduled',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.appointments to authenticated;
grant all on public.appointments to service_role;
alter table public.appointments enable row level security;
create policy "appointments readable by authenticated" on public.appointments for select to authenticated using (true);
create policy "appointments writable by authenticated" on public.appointments for all to authenticated using (true) with check (true);

create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  kind text not null,
  title text not null,
  due_date date not null,
  done boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.reminders to authenticated;
grant all on public.reminders to service_role;
alter table public.reminders enable row level security;
create policy "reminders readable by authenticated" on public.reminders for select to authenticated using (true);
create policy "reminders writable by authenticated" on public.reminders for all to authenticated using (true) with check (true);

create table public.care_gaps (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  item text not null,
  status text not null default 'pending' check (status in ('completed','pending','attention')),
  detail text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.care_gaps to authenticated;
grant all on public.care_gaps to service_role;
alter table public.care_gaps enable row level security;
create policy "gaps readable by authenticated" on public.care_gaps for select to authenticated using (true);
create policy "gaps writable by authenticated" on public.care_gaps for all to authenticated using (true) with check (true);

create table public.vaccinations (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  name text not null,
  given_at date,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.vaccinations to authenticated;
grant all on public.vaccinations to service_role;
alter table public.vaccinations enable row level security;
create policy "vax readable by authenticated" on public.vaccinations for select to authenticated using (true);
create policy "vax writable by authenticated" on public.vaccinations for all to authenticated using (true) with check (true);

create table public.scheme_benefits (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  scheme text not null,
  status text not null default 'pending' check (status in ('received','pending','not_received')),
  note text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.scheme_benefits to authenticated;
grant all on public.scheme_benefits to service_role;
alter table public.scheme_benefits enable row level security;
create policy "schemes readable by authenticated" on public.scheme_benefits for select to authenticated using (true);
create policy "schemes writable by authenticated" on public.scheme_benefits for all to authenticated using (true) with check (true);

create table public.family_members (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  full_name text not null,
  relationship text not null,
  phone text not null,
  access_level text not null default 'limited',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.family_members to authenticated;
grant all on public.family_members to service_role;
alter table public.family_members enable row level security;
create policy "family readable by authenticated" on public.family_members for select to authenticated using (true);
create policy "family writable by authenticated" on public.family_members for all to authenticated using (true) with check (true);

create table public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  level text not null,
  score int not null,
  factors jsonb not null default '[]'::jsonb,
  engine text not null default 'prototype-rule-engine-v1',
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.risk_assessments to authenticated;
grant all on public.risk_assessments to service_role;
alter table public.risk_assessments enable row level security;
create policy "risk readable by authenticated" on public.risk_assessments for select to authenticated using (true);
create policy "risk writable by authenticated" on public.risk_assessments for all to authenticated using (true) with check (true);

create table public.alerts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  severity text not null default 'high',
  reason text not null,
  action text,
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.alerts to authenticated;
grant all on public.alerts to service_role;
alter table public.alerts enable row level security;
create policy "alerts readable by authenticated" on public.alerts for select to authenticated using (true);
create policy "alerts writable by authenticated" on public.alerts for all to authenticated using (true) with check (true);

create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  type text not null,
  distance_km numeric,
  contact text,
  is_open boolean not null default true,
  emergency boolean not null default false,
  district text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.facilities to authenticated;
grant select on public.facilities to anon;
grant all on public.facilities to service_role;
alter table public.facilities enable row level security;
create policy "facilities readable" on public.facilities for select using (true);
create policy "facilities writable by authenticated" on public.facilities for all to authenticated using (true) with check (true);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references public.patients(id) on delete cascade,
  category text not null,
  file_name text not null,
  file_path text,
  ocr_text text,
  ocr_status text not null default 'not_run',
  uploaded_by text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.documents to authenticated;
grant all on public.documents to service_role;
alter table public.documents enable row level security;
create policy "documents readable by authenticated" on public.documents for select to authenticated using (true);
create policy "documents writable by authenticated" on public.documents for all to authenticated using (true) with check (true);

-- ================= DEMO / PROTOTYPE SEED DATA =================
insert into public.hospitals (id, name, location, status) values
 ('11111111-1111-1111-1111-111111111111','MAA Setu Community Hospital','Gautam Buddha Nagar, Uttar Pradesh','Prototype Partner Hospital — Demonstration Only'),
 ('11111111-1111-1111-1111-111111111112','Demo Partner Hospital','Greater Noida, Uttar Pradesh','Prototype Partner Hospital — Demonstration Only');

insert into public.profiles (id, email, full_name, role, phone, department, hospital_id) values
 ('22222222-2222-2222-2222-222222222221','patient@maasetu.demo','Sita Devi','patient','+91 90000 00001',null,'11111111-1111-1111-1111-111111111111'),
 ('22222222-2222-2222-2222-222222222222','doctor1@maasetu.demo','Dr. Ananya Sharma','doctor','+91 90000 00002','Obstetrics & Gynaecology','11111111-1111-1111-1111-111111111111'),
 ('22222222-2222-2222-2222-222222222223','doctor2@maasetu.demo','Dr. Neha Verma','doctor','+91 90000 00003','Obstetrics & Gynaecology','11111111-1111-1111-1111-111111111112'),
 ('22222222-2222-2222-2222-222222222224','admin@maasetu.demo','MAA Setu Hospital Admin','admin','+91 90000 00004','Administration','11111111-1111-1111-1111-111111111111');

insert into public.patients (id, mhid, profile_id, full_name, age, village, district, state, blood_group, pregnancy_number, lmp, edd, emergency_contact_name, emergency_contact_phone, registered_at, registered_by, hospital_id) values
 ('33333333-3333-3333-3333-333333333331','UP-GB-2026-00001','22222222-2222-2222-2222-222222222221','Sita Devi',24,'Rampur','Gautam Buddha Nagar','Uttar Pradesh','B+',1,'2025-11-20','2026-08-27','Ramesh Kumar (Husband)','+91 90000 11111','2025-12-15 10:00:00+00','22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111');

insert into public.medical_records (patient_id, record_type, title, summary, pregnancy_month, pregnancy_week, recorded_at, provider_id, provider_name, hospital_name, vitals, notes, recommendations) values
 ('33333333-3333-3333-3333-333333333331','checkup','Registration & Pregnancy Confirmation','First pregnancy confirmed. MHID created at facility. Initial antenatal check-up completed.',1,6,'2025-12-15 10:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"110/70","weight_kg":48,"pulse":78}','Patient in good general health. First pregnancy (G1P0).','Start iron and folic acid supplements. Next visit in 4 weeks.'),
 ('33333333-3333-3333-3333-333333333331','blood_test','Initial Blood Investigation','Haemoglobin, blood group and routine screening.',1,6,'2025-12-15 11:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"hb":10.8,"blood_group":"B+"}','Mild anaemia noted.','Iron rich diet advised.'),
 ('33333333-3333-3333-3333-333333333331','urine_test','Urine Routine Test','Routine urine examination — no abnormality detected.',1,6,'2025-12-15 11:30:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"protein":"nil","sugar":"nil"}','Normal report.','Repeat at next trimester.'),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC Follow-up Visit 2','Routine antenatal follow-up. Mild nausea reported.',2,10,'2026-01-14 10:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"112/72","weight_kg":49}','Nausea improving. Fetal heart not yet auscultated.','Continue supplements, small frequent meals.'),
 ('33333333-3333-3333-3333-333333333331','prescription','Supplements Prescribed','Iron + Folic acid, Calcium.',2,10,'2026-01-14 10:30:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"medicines":"IFA 1 tab daily, Calcium 500mg daily"}','Tolerating medicines well.','Take iron tablet after meals.'),
 ('33333333-3333-3333-3333-333333333331','ultrasound','First Trimester Ultrasound','Single live intrauterine pregnancy corresponding to 13 weeks.',3,13,'2026-02-12 09:30:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"gestational_age":"13w2d","fetal_heart":"present"}','Ultrasound findings normal.','Anomaly scan at 18-20 weeks.'),
 ('33333333-3333-3333-3333-333333333331','blood_test','Blood Investigation (Repeat)','Haemoglobin improved after supplementation.',3,13,'2026-02-12 10:15:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"hb":11.2}','Anaemia improving.','Continue iron supplements.'),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC Check-up Visit 4','Routine check-up. Fetal movements not yet felt.',4,17,'2026-03-13 10:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"114/74","weight_kg":51.5}','Progressing well.','Anomaly scan next month.'),
 ('33333333-3333-3333-3333-333333333331','vaccination','TT / Td Immunisation — Dose 1','Tetanus-diphtheria immunisation dose 1 administered.',4,17,'2026-03-13 10:30:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"vaccine":"Td dose 1"}','No adverse reaction observed.','Second dose after 4 weeks.'),
 ('33333333-3333-3333-3333-333333333331','blood_sugar','Blood Sugar Screening','Random blood sugar within normal range.',5,21,'2026-04-11 09:45:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"rbs":98}','No signs of gestational diabetes.','Repeat at 24-28 weeks.'),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC Check-up Visit 5','Fetal movements felt. Routine examination normal.',5,21,'2026-04-11 10:15:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"116/76","weight_kg":53.5}','Fundal height appropriate for gestational age.','Continue supplements, rest adequately.'),
 ('33333333-3333-3333-3333-333333333331','doctor_notes','Care Transfer Note','Patient relocating within district; care to continue at Demo Partner Hospital.',5,22,'2026-04-20 10:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{}','All records verified and available via MHID UP-GB-2026-00001.','Continuity of care through MAA Setu MHID.'),
 ('33333333-3333-3333-3333-333333333331','ultrasound','Growth Scan','Fetal growth appropriate. Placenta anterior, adequate amniotic fluid.',6,25,'2026-05-10 09:30:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"gestational_age":"25w1d","efw_g":780}','Normal growth scan.','Routine follow-up in 4 weeks.'),
 ('33333333-3333-3333-3333-333333333331','blood_test','Blood & Urine Report','Haemoglobin 11.4 g/dL. Urine routine normal.',6,25,'2026-05-10 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"hb":11.4,"protein":"nil"}','Reports satisfactory.','Continue iron and calcium.'),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC Check-up Visit 6','Routine antenatal visit after change of healthcare provider.',6,25,'2026-05-10 10:30:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"bp":"118/78","weight_kg":55.5}','Previous verified records reviewed via MHID.','Continue supplements.'),
 ('33333333-3333-3333-3333-333333333331','blood_pressure','Elevated Blood Pressure Recorded','BP 142/92 mmHg recorded at visit. Mild pedal oedema noted.',7,29,'2026-06-09 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"bp":"142/92","weight_kg":58}','Elevated reading; repeat measurement after rest also raised.','Medical evaluation and BP monitoring recommended. Reduce salt intake.'),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC Check-up Visit 7 with Risk Review','Antenatal visit with prototype risk review.',7,29,'2026-06-09 10:45:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"bp":"140/90","weight_kg":58}','Flagged for closer monitoring due to elevated BP.','Weekly BP check at nearest PHC.'),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC Check-up Visit 8 & Fetal Assessment','Fetal heart rate normal, cephalic presentation.',8,33,'2026-07-09 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"bp":"134/86","weight_kg":60,"fhr":142}','BP improved with lifestyle measures.','Begin delivery preparation and birth planning.'),
 ('33333333-3333-3333-3333-333333333331','prescription','Third Trimester Medicines','Iron, Calcium, and dietary advice continued.',8,33,'2026-07-09 10:30:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"medicines":"IFA, Calcium 500mg BD"}','Compliance good.','Institutional delivery advised.'),
 ('33333333-3333-3333-3333-333333333331','checkup','Final Antenatal Check-up & Delivery Plan','Term assessment. Delivery plan discussed with family.',9,37,'2026-08-08 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"bp":"130/84","weight_kg":62,"fhr":140}','Cephalic, term, adequate fluid. Ready for institutional delivery.','Report to facility at onset of labour. Keep MHID card ready.'),
 ('33333333-3333-3333-3333-333333333331','delivery','Delivery Outcome — Demo Placeholder','Delivery outcome record placeholder for prototype demonstration.',9,39,'2026-08-20 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner Hospital','{"status":"awaiting delivery (demo placeholder)"}','This is prototype/demo data — not an actual delivery record.','Postpartum and newborn care schedule prepared.');

insert into public.consents (patient_id, provider_id, provider_name, status, purpose, requested_at, decided_at) values
 ('33333333-3333-3333-3333-333333333331','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','granted','Registration and antenatal care','2025-12-15 09:55:00+00','2025-12-15 09:56:00+00');

insert into public.access_logs (patient_id, provider_name, action, reason, created_at) values
 ('33333333-3333-3333-3333-333333333331','Dr. Ananya Sharma','Created MHID and registered patient','Facility registration','2025-12-15 10:00:00+00'),
 ('33333333-3333-3333-3333-333333333331','Dr. Ananya Sharma','Viewed medical records','Antenatal check-up','2026-04-11 10:10:00+00');

insert into public.appointments (patient_id, title, scheduled_at, provider_name, status) values
 ('33333333-3333-3333-3333-333333333331','Final term review','2026-08-25 10:00:00+00','Dr. Neha Verma','scheduled'),
 ('33333333-3333-3333-3333-333333333331','Postpartum check-up (planned)','2026-09-05 10:00:00+00','Dr. Neha Verma','scheduled');

insert into public.reminders (patient_id, kind, title, due_date, done) values
 ('33333333-3333-3333-3333-333333333331','checkup','Term review check-up','2026-08-25',false),
 ('33333333-3333-3333-3333-333333333331','medication','Take iron & calcium tablets daily','2026-08-22',false),
 ('33333333-3333-3333-3333-333333333331','test','Blood pressure check at nearest PHC','2026-08-24',false),
 ('33333333-3333-3333-3333-333333333331','delivery','Expected delivery period approaching','2026-08-27',false),
 ('33333333-3333-3333-3333-333333333331','vaccination','Newborn BCG & OPV after delivery','2026-09-01',false);

insert into public.care_gaps (patient_id, item, status, detail) values
 ('33333333-3333-3333-3333-333333333331','ANC visits (minimum 8)','completed','9 antenatal visits recorded'),
 ('33333333-3333-3333-3333-333333333331','Haemoglobin test','completed','Last value 11.4 g/dL'),
 ('33333333-3333-3333-3333-333333333331','Ultrasound scans','completed','2 scans recorded'),
 ('33333333-3333-3333-3333-333333333331','Td immunisation dose 2','pending','Second dose not recorded'),
 ('33333333-3333-3333-3333-333333333331','Blood pressure follow-up','attention','Elevated BP recorded at month 7'),
 ('33333333-3333-3333-3333-333333333331','Repeat blood sugar (24-28 weeks)','pending','Not recorded in timeline');

insert into public.vaccinations (patient_id, name, given_at, status) values
 ('33333333-3333-3333-3333-333333333331','Td / TT dose 1','2026-03-13','completed'),
 ('33333333-3333-3333-3333-333333333331','Td / TT dose 2',null,'pending');

insert into public.scheme_benefits (patient_id, scheme, status, note) values
 ('33333333-3333-3333-3333-333333333331','Demo Maternity Benefit Scheme A','received','Demo entry — first instalment recorded'),
 ('33333333-3333-3333-3333-333333333331','Demo Institutional Delivery Support','pending','Demo entry — awaiting delivery'),
 ('33333333-3333-3333-3333-333333333331','Demo Nutrition Support Programme','received','Demo entry'),
 ('33333333-3333-3333-3333-333333333331','Demo Transport Assistance','not_received','Demo entry — application not submitted');

insert into public.family_members (patient_id, full_name, relationship, phone, access_level) values
 ('33333333-3333-3333-3333-333333333331','Ramesh Kumar','Husband','+91 90000 11111','limited');

insert into public.alerts (patient_id, severity, reason, action) values
 ('33333333-3333-3333-3333-333333333331','high','Elevated BP detected in recent record (142/92 mmHg).','Medical evaluation recommended.'),
 ('33333333-3333-3333-3333-333333333331','moderate','Repeat blood sugar test for 24-28 weeks not recorded.','Schedule the pending test.');

insert into public.facilities (name, type, distance_km, contact, is_open, emergency, district) values
 ('Rampur Primary Health Centre','PHC',2.5,'+91 90000 22221',true,false,'Gautam Buddha Nagar'),
 ('Dankaur Community Health Centre','CHC',8.0,'+91 90000 22222',true,true,'Gautam Buddha Nagar'),
 ('District Government Hospital, Noida','District Hospital',18.5,'+91 90000 22223',true,true,'Gautam Buddha Nagar'),
 ('MAA Setu Community Hospital','Prototype Partner Hospital',12.0,'+91 90000 22224',true,true,'Gautam Buddha Nagar'),
 ('Demo Partner Hospital, Greater Noida','Registered Private Facility',15.2,'+91 90000 22225',false,false,'Gautam Buddha Nagar');

insert into public.documents (patient_id, category, file_name, ocr_status, uploaded_by) values
 ('33333333-3333-3333-3333-333333333331','ultrasound','ultrasound-13weeks-demo.pdf','not_run','Dr. Ananya Sharma'),
 ('33333333-3333-3333-3333-333333333331','blood_report','haemoglobin-report-demo.pdf','not_run','Dr. Ananya Sharma');

insert into public.risk_assessments (patient_id, level, score, factors) values
 ('33333333-3333-3333-3333-333333333331','moderate',46,'[{"factor":"Elevated blood pressure (142/92)","weight":25},{"factor":"Haemoglobin below 12 g/dL","weight":10},{"factor":"First pregnancy","weight":6},{"factor":"Gestational age 37+ weeks","weight":5}]'::jsonb);
