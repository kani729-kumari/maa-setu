-- Demo/prototype seed data for MAA Setu (idempotent)
DELETE FROM public.access_logs;
DELETE FROM public.alerts;
DELETE FROM public.appointments;
DELETE FROM public.care_gaps;
DELETE FROM public.consents;
DELETE FROM public.documents;
DELETE FROM public.family_members;
DELETE FROM public.medical_records;
DELETE FROM public.reminders;
DELETE FROM public.risk_assessments;
DELETE FROM public.scheme_benefits;
DELETE FROM public.vaccinations;
DELETE FROM public.patients;
DELETE FROM public.profiles;
DELETE FROM public.facilities;
DELETE FROM public.hospitals;

INSERT INTO public.hospitals (id, name, location, status) VALUES
 ('11111111-1111-1111-1111-111111111111','MAA Setu Community Hospital','Gautam Buddha Nagar, Uttar Pradesh','Prototype Partner Hospital — Demonstration Only'),
 ('11111111-1111-1111-1111-111111111112','Demo Partner District Hospital','Dadri, Gautam Buddha Nagar, Uttar Pradesh','Prototype Partner Hospital — Demonstration Only');

INSERT INTO public.profiles (id, email, full_name, role, phone, department, hospital_id, is_demo) VALUES
 ('22222222-2222-2222-2222-222222222221','patient@maasetu.demo','Sita Devi','patient','+91 90000 00001',NULL,'11111111-1111-1111-1111-111111111111',true),
 ('22222222-2222-2222-2222-222222222222','doctor1@maasetu.demo','Dr. Ananya Sharma','doctor','+91 90000 00002','Obstetrics & Gynaecology','11111111-1111-1111-1111-111111111111',true),
 ('22222222-2222-2222-2222-222222222223','doctor2@maasetu.demo','Dr. Neha Verma','doctor','+91 90000 00003','Obstetrics & Gynaecology','11111111-1111-1111-1111-111111111112',true),
 ('22222222-2222-2222-2222-222222222224','admin@maasetu.demo','MAA Setu Hospital Admin','admin','+91 90000 00004','Administration','11111111-1111-1111-1111-111111111111',true);

INSERT INTO public.patients (id, mhid, profile_id, full_name, age, village, district, state, blood_group, pregnancy_number, lmp, edd, status, emergency_contact_name, emergency_contact_phone, registered_at, registered_by, hospital_id) VALUES
 ('33333333-3333-3333-3333-333333333331','UP-GB-2026-00001','22222222-2222-2222-2222-222222222221','Sita Devi',24,'Rampur','Gautam Buddha Nagar','Uttar Pradesh','B+',1,'2025-12-01','2026-09-07','active','Ramesh Kumar (Husband)','+91 90000 11111','2025-12-28 10:00:00+00','22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111'),
 ('33333333-3333-3333-3333-333333333332','UP-GB-2026-00002',NULL,'Kavita Yadav',31,'Bilaspur','Gautam Buddha Nagar','Uttar Pradesh','O+',3,'2026-01-15','2026-10-22','active','Suresh Yadav (Husband)','+91 90000 22222','2026-02-12 10:00:00+00','22222222-2222-2222-2222-222222222222','11111111-1111-1111-1111-111111111111'),
 ('33333333-3333-3333-3333-333333333333','UP-GB-2026-00003',NULL,'Meena Kumari',19,'Jewar','Gautam Buddha Nagar','Uttar Pradesh','A+',1,'2026-02-20','2026-11-27','active','Lata Devi (Mother)','+91 90000 33333','2026-03-18 10:00:00+00','22222222-2222-2222-2222-222222222223','11111111-1111-1111-1111-111111111112');

-- Sita Devi: months 1-5 by Dr. Ananya Sharma
INSERT INTO public.medical_records (patient_id, record_type, title, summary, pregnancy_month, pregnancy_week, recorded_at, provider_id, provider_name, hospital_name, vitals, notes, recommendations, verified) VALUES
 ('33333333-3333-3333-3333-333333333331','checkup','Registration & pregnancy confirmation','First visit, pregnancy confirmed by urine test and clinical examination.',1,4,'2025-12-28 10:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"116/74","weight":48,"pulse":78}','Patient registered, MHID issued. First pregnancy.','Start folic acid, iron-rich diet, monthly ANC visits.',true),
 ('33333333-3333-3333-3333-333333333331','blood_test','Baseline blood investigation','Complete blood count and blood grouping.',1,4,'2025-12-28 11:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"hb":11.4,"blood_group":"B+"}','Mild borderline haemoglobin.','Iron and folic acid supplements daily.',true),
 ('33333333-3333-3333-3333-333333333331','urine_test','Routine urine examination','Albumin nil, sugar nil.',1,4,'2025-12-28 11:20:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"albumin":"nil","sugar":"nil"}','Normal report.','Repeat at next visit.',true),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC follow-up — Month 2','Routine antenatal follow-up, mild nausea reported.',2,8,'2026-01-25 10:15:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"118/76","weight":49}','Weight gain appropriate.','Small frequent meals, continue supplements.',true),
 ('33333333-3333-3333-3333-333333333331','prescription','Supplements — Month 2','Iron, folic acid and calcium supplements.',2,8,'2026-01-25 10:30:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{}','IFA tablet once daily, calcium 500mg once daily.','Take iron after meals with lemon water.',true),
 ('33333333-3333-3333-3333-333333333331','ultrasound','First-trimester ultrasound','Single live intrauterine pregnancy, cardiac activity present.',3,12,'2026-02-22 09:45:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"gestational_age_weeks":12,"fetal_heart_rate":152}','Growth consistent with dates.','Next scan at 20 weeks (anomaly scan).',true),
 ('33333333-3333-3333-3333-333333333331','blood_test','Blood investigation — Month 3','Haemoglobin and thyroid screening.',3,12,'2026-02-22 10:30:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"hb":10.9,"tsh":2.1}','Mild anaemia noted.','Continue iron, add green leafy vegetables.',true),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC check-up — Month 4','Routine antenatal visit, fetal movements not yet felt.',4,16,'2026-03-22 10:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"120/78","weight":52}','Progress satisfactory.','Report if bleeding, severe headache or reduced movements.',true),
 ('33333333-3333-3333-3333-333333333331','vaccination','TT / Td first dose','Tetanus-diphtheria immunisation, first dose given.',4,16,'2026-03-22 10:40:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{}','No adverse reaction observed.','Second dose after four weeks.',true),
 ('33333333-3333-3333-3333-333333333331','blood_sugar','Blood sugar screening','Random blood sugar within normal range.',5,20,'2026-04-19 09:30:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"rbs":102}','Normal glucose screening.','Repeat OGTT at 24-28 weeks.',true),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC check-up — Month 5','Fetal movements felt, patient comfortable.',5,20,'2026-04-19 10:00:00+00','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"122/80","weight":54,"fundal_height_cm":20}','Anomaly scan advised.','Patient relocating to family home — records to follow via MHID.',true);

-- Months 6-9 by Dr. Neha Verma (after provider change)
INSERT INTO public.medical_records (patient_id, record_type, title, summary, pregnancy_month, pregnancy_week, recorded_at, provider_id, provider_name, hospital_name, vitals, notes, recommendations, verified) VALUES
 ('33333333-3333-3333-3333-333333333331','ultrasound','Anomaly scan — Month 6','Detailed anomaly scan, no structural abnormality detected.',6,24,'2026-05-17 09:30:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{"gestational_age_weeks":24,"fetal_heart_rate":146,"efw_g":650}','Placenta upper segment, liquor adequate.','Continue routine ANC every four weeks.',true),
 ('33333333-3333-3333-3333-333333333331','blood_test','Blood & urine report — Month 6','Haemoglobin improved, urine routine normal.',6,24,'2026-05-17 10:10:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{"hb":11.2,"albumin":"nil"}','Response to iron therapy good.','Continue supplements.',true),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC check-up — Month 7','Mild pedal oedema, blood pressure raised.',7,28,'2026-06-14 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{"bp":"142/92","weight":58,"fundal_height_cm":28}','Elevated blood pressure recorded — flagged for evaluation.','Salt restriction, rest, repeat BP in one week, medical evaluation recommended.',true),
 ('33333333-3333-3333-3333-333333333331','blood_sugar','OGTT — Month 7','Oral glucose tolerance test, borderline value.',7,28,'2026-06-14 10:30:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{"rbs":128}','Borderline glucose value.','Dietary counselling, repeat testing.',true),
 ('33333333-3333-3333-3333-333333333331','checkup','ANC follow-up — Month 8','Fetal assessment satisfactory, BP improving.',8,32,'2026-07-12 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{"bp":"134/86","weight":60,"fetal_heart_rate":140}','Delivery preparation counselling done.','Institutional delivery planned, keep MHID card ready.',true),
 ('33333333-3333-3333-3333-333333333331','prescription','Medicines — Month 8','Iron, calcium and antihypertensive review.',8,32,'2026-07-12 10:25:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{}','Medication reviewed with patient and husband.','Bring all reports at every visit.',true),
 ('33333333-3333-3333-3333-333333333331','checkup','Final antenatal check-up — Month 9','Term assessment, cephalic presentation.',9,37,'2026-08-09 10:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{"bp":"130/84","weight":62,"fetal_heart_rate":138,"fundal_height_cm":36}','Patient counselled on labour signs.','Report immediately with labour pain, leaking or reduced movements.',true),
 ('33333333-3333-3333-3333-333333333331','doctor_notes','Delivery plan','Planned institutional delivery at Demo Partner District Hospital.',9,37,'2026-08-09 10:30:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{}','Blood group B+, arrange attendant and transport.','Postpartum visit within 7 days of delivery.',true),
 ('33333333-3333-3333-3333-333333333331','delivery','Delivery record (demo placeholder)','Awaiting delivery — record reserved for outcome entry.',9,39,'2026-08-20 09:00:00+00','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','Demo Partner District Hospital','{}','Prototype placeholder record.','To be completed at delivery.',true);

INSERT INTO public.medical_records (patient_id, record_type, title, summary, pregnancy_month, pregnancy_week, recorded_at, provider_name, hospital_name, vitals, verified) VALUES
 ('33333333-3333-3333-3333-333333333332','checkup','ANC check-up','Routine visit, third pregnancy.',5,20,'2026-06-01 10:00:00+00','Dr. Ananya Sharma','MAA Setu Community Hospital','{"bp":"128/84","hb":9.6,"weight":55}',true),
 ('33333333-3333-3333-3333-333333333333','checkup','ANC check-up','First visit, young mother.',4,16,'2026-06-10 10:00:00+00','Dr. Neha Verma','Demo Partner District Hospital','{"bp":"118/76","hb":8.4,"weight":44}',true);

INSERT INTO public.consents (patient_id, provider_id, provider_name, status, purpose, requested_at, decided_at) VALUES
 ('33333333-3333-3333-3333-333333333331','22222222-2222-2222-2222-222222222222','Dr. Ananya Sharma','granted','Antenatal care at registering hospital','2025-12-28 09:55:00+00','2025-12-28 09:56:00+00'),
 ('33333333-3333-3333-3333-333333333331','22222222-2222-2222-2222-222222222223','Dr. Neha Verma','pending','Provider change — access to previous verified maternal health records','2026-05-17 09:00:00+00',NULL);

INSERT INTO public.access_logs (patient_id, provider_name, action, reason, created_at) VALUES
 ('33333333-3333-3333-3333-333333333331','Dr. Ananya Sharma','viewed records','Antenatal consultation','2026-04-19 09:55:00+00'),
 ('33333333-3333-3333-3333-333333333331','Dr. Neha Verma','searched','MHID lookup after provider change','2026-05-17 08:58:00+00'),
 ('33333333-3333-3333-3333-333333333331','Dr. Neha Verma','requested consent','Follow-up consultation','2026-05-17 09:00:00+00');

INSERT INTO public.appointments (patient_id, title, scheduled_at, provider_name, status) VALUES
 ('33333333-3333-3333-3333-333333333331','ANC follow-up visit','2026-08-27 10:00:00+00','Dr. Neha Verma','scheduled'),
 ('33333333-3333-3333-3333-333333333331','Repeat blood pressure check','2026-06-21 10:00:00+00','Dr. Neha Verma','missed'),
 ('33333333-3333-3333-3333-333333333331','Delivery admission planning','2026-09-01 09:00:00+00','Dr. Neha Verma','scheduled'),
 ('33333333-3333-3333-3333-333333333332','ANC follow-up visit','2026-08-30 10:00:00+00','Dr. Ananya Sharma','scheduled');

INSERT INTO public.reminders (patient_id, kind, title, due_date, done) VALUES
 ('33333333-3333-3333-3333-333333333331','checkup','Next antenatal check-up','2026-08-27',false),
 ('33333333-3333-3333-3333-333333333331','medicine','Daily iron & calcium tablet','2026-08-23',false),
 ('33333333-3333-3333-3333-333333333331','test','Repeat blood pressure monitoring','2026-08-25',false),
 ('33333333-3333-3333-3333-333333333331','delivery','Expected delivery period begins','2026-09-01',false),
 ('33333333-3333-3333-3333-333333333331','vaccination','TT / Td second dose completed','2026-04-19',true);

INSERT INTO public.care_gaps (patient_id, item, status, detail) VALUES
 ('33333333-3333-3333-3333-333333333331','ANC visits (minimum 4)','completed','5 antenatal visits recorded'),
 ('33333333-3333-3333-3333-333333333331','Anomaly ultrasound','completed','Done at 24 weeks'),
 ('33333333-3333-3333-3333-333333333331','TT / Td immunisation','completed','Both doses recorded'),
 ('33333333-3333-3333-3333-333333333331','Repeat blood pressure review','attention','Missed follow-up after elevated BP in month 7'),
 ('33333333-3333-3333-3333-333333333331','Third-trimester haemoglobin','pending','Report not uploaded yet');

INSERT INTO public.vaccinations (patient_id, name, given_at, status) VALUES
 ('33333333-3333-3333-3333-333333333331','TT / Td — first dose','2026-03-22','completed'),
 ('33333333-3333-3333-3333-333333333331','TT / Td — second dose','2026-04-19','completed'),
 ('33333333-3333-3333-3333-333333333331','Newborn BCG (after delivery)',NULL,'pending');

INSERT INTO public.scheme_benefits (patient_id, scheme, status, note) VALUES
 ('33333333-3333-3333-3333-333333333331','Demo Maternity Benefit Scheme A','received','First instalment credited (demo)'),
 ('33333333-3333-3333-3333-333333333331','Demo Institutional Delivery Support','pending','Applied, verification in progress (demo)'),
 ('33333333-3333-3333-3333-333333333331','Demo Nutrition Support Programme','not_received','Documents pending (demo)'),
 ('33333333-3333-3333-3333-333333333332','Demo Maternity Benefit Scheme A','pending','Application submitted (demo)');

INSERT INTO public.family_members (patient_id, full_name, relationship, phone, access_level) VALUES
 ('33333333-3333-3333-3333-333333333331','Ramesh Kumar','Husband','+91 90000 11111','limited'),
 ('33333333-3333-3333-3333-333333333331','Kamla Devi','Mother-in-law','+91 90000 44444','emergency_only');

INSERT INTO public.alerts (patient_id, severity, reason, action, resolved) VALUES
 ('33333333-3333-3333-3333-333333333331','high','Elevated blood pressure detected in recent record (142/92 mmHg).','Medical evaluation recommended.',false),
 ('33333333-3333-3333-3333-333333333331','medium','Missed follow-up visit for repeat blood pressure check.','Contact patient and reschedule visit.',false),
 ('33333333-3333-3333-3333-333333333333','high','Low haemoglobin (8.4 g/dL) in a young first-time mother.','Anaemia management and evaluation recommended.',false);

INSERT INTO public.facilities (name, type, distance_km, contact, is_open, emergency, district) VALUES
 ('Rampur Primary Health Centre','PHC',2.4,'+91 90000 55501',true,false,'Gautam Buddha Nagar'),
 ('Dadri Community Health Centre','CHC',7.8,'+91 90000 55502',true,true,'Gautam Buddha Nagar'),
 ('District Women & Child Hospital','District Hospital',14.2,'+91 90000 55503',true,true,'Gautam Buddha Nagar'),
 ('MAA Setu Community Hospital','Prototype Partner Hospital',9.1,'+91 90000 55504',true,true,'Gautam Buddha Nagar'),
 ('Jewar Sub-Centre','Sub-Centre',18.6,'+91 90000 55505',false,false,'Gautam Buddha Nagar');

INSERT INTO public.documents (patient_id, category, file_name, file_path, ocr_status, uploaded_by) VALUES
 ('33333333-3333-3333-3333-333333333331','ultrasound','anomaly-scan-24w.pdf',NULL,'not_run','Dr. Neha Verma'),
 ('33333333-3333-3333-3333-333333333331','blood_report','cbc-month-6.pdf',NULL,'not_run','Dr. Neha Verma'),
 ('33333333-3333-3333-3333-333333333331','prescription','prescription-month-8.jpg',NULL,'not_run','Dr. Neha Verma');
