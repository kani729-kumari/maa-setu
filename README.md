# Remix of MAA Setu Connect

# Build the Complete MAA Setu Maternal Healthcare Web Application

Build a complete, polished, functional full-stack web application called **“MAA Setu”**.

**Tagline:** “जोड़ें सेहत, माँ और भविष्य”

MAA Setu is a bilingual maternal healthcare platform designed especially for women in rural areas. Its most important purpose is to create a **unique Maternal Health ID (MHID)** at a healthcare facility and maintain the woman's complete pregnancy medical history digitally so that her verified records can follow her when she changes doctors or hospitals.

## IMPORTANT

Do not create only a landing page or visual mockup.

Build a **working prototype with frontend + backend + database + authentication + role-based dashboards + medical-record storage + MHID system + consent-based record sharing + pregnancy timeline + demo data + AI-based prototype risk assessment**.

Use **Supabase or the most suitable built-in backend/database solution** for authentication, database, storage and backend logic.

Use realistic **synthetic/demo patient data**. Clearly label demo data as “Prototype / Demo Data”. Do NOT claim that fictional hospitals or doctors are actually certified.

Do not ask me unnecessary clarification questions. Make sensible implementation decisions and build the complete application.

---

# 1. CORE CONCEPT — MOST IMPORTANT

The central workflow must be:

**Hospital/Doctor registers pregnant woman**

↓

**Hospital creates unique Maternal Health ID (MHID)**

Example:

**MHID: UP-GB-2026-00001**

↓

Woman receives the MHID.

↓

During every check-up, the **doctor/authorized healthcare worker uploads the woman's medical records**.

↓

All records automatically become part of the woman's **chronological pregnancy timeline**.

↓

If the woman changes doctor/hospital:

**Doctor 2 searches/scans the MHID**

↓

**Patient consent is obtained**

↓

Doctor 2 can view the woman's previously verified medical history

↓

Doctor 2 continues adding new records.

This is the most important demonstration of the entire website.

---

# 2. USER ROLES

Create separate role-based access for:

### A. Pregnant Woman / Patient

Can:

* Login
* View profile
* View MHID
* View QR code for MHID
* View pregnancy timeline
* View uploaded medical records
* View reports
* View prescriptions
* View vaccination records
* View appointments
* View reminders
* View risk status
* Give/revoke consent for healthcare-provider access
* View which healthcare provider accessed her records
* View emergency information
* Switch language between English and Hindi

The woman should NOT be able to create or edit official medical records herself.

---

### B. Doctor / Healthcare Worker

Can:

* Login securely
* Search patient using MHID
* Scan/enter MHID
* Request patient consent
* View authorized patient records
* Register a new pregnant woman
* Create MHID
* Upload medical reports
* Add check-up information
* Add BP
* Add blood sugar
* Add blood/urine test results
* Upload ultrasound reports
* Add medicines
* Add vaccination information
* Add doctor notes
* Add recommendations
* Update pregnancy status
* Record high-risk indicators
* View complete pregnancy timeline
* Add new records to the timeline
* View previous verified records
* View previous doctor/hospital information where permitted

---

### C. Hospital/Admin

Can:

* Login
* View registered doctors
* View registered patients
* Register/verify doctors for the prototype
* Create MHIDs
* View maternal-health statistics
* View high-risk cases
* View care gaps
* View scheme-benefit status
* View healthcare activity
* Manage demo hospital information

---

# 3. DEMO HOSPITAL AND DOCTORS

Create realistic fictional prototype data.

Use:

**Hospital:** MAA Setu Community Hospital
**Location:** Gautam Buddha Nagar, Uttar Pradesh
**Status:** “Prototype Partner Hospital — Demonstration Only”

Create two fictional doctors:

### Doctor 1

**Dr. Ananya Sharma**
Department: Obstetrics & Gynaecology
Hospital: MAA Setu Community Hospital

### Doctor 2

**Dr. Neha Verma**
Department: Obstetrics & Gynaecology
Hospital: MAA Setu Community Hospital / Demo Partner Hospital

Clearly label them as **Demo Doctors**.

---

# 4. DEMO PATIENT — COMPLETE 9-MONTH JOURNEY

Create one complete synthetic patient record for demonstration.

Name:

**Sita Devi**

Age:

**24 years**

Village:

**Rampur**

District:

**Gautam Buddha Nagar**

State:

**Uttar Pradesh**

Pregnancy:

**First pregnancy**

Blood group:

**B+**

MHID:

**UP-GB-2026-00001**

EDD:

Use a realistic 9-month pregnancy timeline.

Create approximately one or more medical records for every month.

### Month 1

* Registration
* Pregnancy confirmation
* Initial antenatal check-up
* BP
* Weight
* Blood tests
* Urine test
* Doctor notes

### Month 2

* ANC follow-up
* BP
* Weight
* Medicines/supplements
* Doctor recommendation

### Month 3

* Ultrasound report
* Blood investigation
* Doctor notes
* Pregnancy status

### Month 4

* ANC check-up
* BP
* Weight
* Vaccination/immunization
* Medicines

### Month 5

* Blood sugar
* BP
* Weight
* Routine check-up
* Doctor notes

### Month 6

* Ultrasound
* Blood/urine report
* ANC check-up
* Supplements/medicines

### Month 7

* ANC check-up
* BP
* Weight
* Risk assessment
* Doctor recommendation

### Month 8

* Follow-up
* BP
* Weight
* Fetal assessment
* Medicines
* Delivery preparation

### Month 9

* Final antenatal check-up
* BP
* Weight
* Final assessment
* Delivery plan
* Delivery outcome placeholder/demo record

Make these records appear in a beautiful **vertical chronological pregnancy timeline**.

---

# 5. SHOW THE CHANGE OF DOCTOR

This is essential.

Initially:

**Doctor 1 — Dr. Ananya Sharma**

adds the patient's records from approximately Month 1 to Month 5.

Then create a simulated event:

**“Patient changed healthcare provider.”**

Then:

**Doctor 2 — Dr. Neha Verma**

searches:

**UP-GB-2026-00001**

Doctor 2 sees:

> Previous Verified Medical Records Found

Show:

* Previous check-ups
* Previous ultrasound
* Blood/urine reports
* BP history
* Blood sugar
* Medicines
* Vaccination
* Previous doctor notes
* Pregnancy timeline

But only after:

> **Patient Consent Required**

Create a consent popup:

**“Sita Devi has been asked to allow Dr. Neha Verma to access her verified maternal health records.”**

Buttons:

**Allow Access**

**Deny Access**

After Allow Access:

> ✓ Consent Granted
> Previous verified records are now available to the authorized healthcare provider.

Then Doctor 2 adds Month 6–9 records.

This must visibly demonstrate the project's main innovation:

**Continuity of care despite changing doctors.**

---

# 6. MHID SYSTEM

Create a unique Maternal Health ID.

Format:

**UP-GB-2026-00001**

The hospital creates the ID during registration.

Do NOT allow the patient to manually create an MHID.

Create:

* MHID card
* QR code
* Copy MHID button
* Download/print MHID card option
* Share MHID option

The MHID card should show:

* MAA Setu logo
* Patient name
* MHID
* Date of registration
* QR code
* Emergency contact
* “Show this ID at authorized healthcare facilities”

Do NOT place sensitive medical information directly inside the QR code.

---

# 7. DIGITAL MEDICAL RECORDS

Create a proper medical-record system.

Each record should contain:

* Date
* Pregnancy month/week
* Healthcare provider
* Hospital
* Record type
* Summary
* Attachments
* Doctor notes
* Recommendations
* Verification status

Record categories:

* Check-up
* Ultrasound
* Blood test
* Urine test
* Blood pressure
* Blood sugar
* Vaccination
* Prescription
* Doctor notes
* Previous pregnancy history
* Delivery record

Allow doctor-side upload of PDF/image documents.

Store uploaded documents securely.

---

# 8. PREGNANCY TIMELINE

Create a visually attractive timeline:

**Month 1 → Month 2 → Month 3 → ... → Month 9**

Each month should show cards for:

* Check-up
* Reports
* BP
* Blood sugar
* Ultrasound
* Medicines
* Doctor notes

Use icons and status indicators.

Allow the doctor to click each record to view details.

---

# 9. AI / PREGNANCY RISK ASSESSMENT

Add an **AI-Assisted Pregnancy Risk Assessment** prototype.

Use available patient parameters such as:

* Age
* Blood pressure
* Blood sugar
* Haemoglobin
* Symptoms
* Pregnancy history
* Gestational age
* Other clinically relevant values

Show:

**Risk Level: Low / Moderate / High**

Also show the major factors contributing to the prototype assessment.

Example:

> ⚠️ Attention Required
> Elevated BP detected in recent records.

Include:

> **This prototype provides decision-support information and does not replace diagnosis or medical advice.**

If a real ML model/API is not available, implement a clearly labelled **prototype risk-scoring engine** rather than pretending that a clinically validated ML model exists.

Structure the backend so a validated ML model/API can be connected later.

---

# 10. HIGH-RISK ALERTS

Create alerts for concerning values.

Examples:

* Elevated BP
* Abnormal blood sugar
* Missed check-up
* Missing important report
* Possible care gap

Show:

**🚨 High-Risk Alert**

Patient:

Sita Devi

MHID:

UP-GB-2026-00001

Reason:

Elevated BP detected in recent record.

Recommended action:

“Medical evaluation recommended.”

Do not claim that the system diagnoses a disease.

---

# 11. CARE GAP TRACKER

Create a care-gap page.

Track:

* Missed ANC visit
* Missing blood test
* Missing ultrasound
* Missing vaccination
* Missed follow-up
* Missing required record

Use:

✓ Completed
⚠ Pending
🚨 Attention required

---

# 12. SMART REMINDERS

Create reminders for:

* Upcoming check-up
* Vaccination
* Medication
* Important tests
* Follow-up visit
* Expected delivery period

Show reminders on patient and healthcare-worker dashboards where appropriate.

Use demo notifications rather than requiring real SMS initially.

---

# 13. “WHAT DO I DO NOW?” FEATURE

Create a very simple rural-friendly page.

The woman answers/selects:

* What month of pregnancy?
* Any warning symptoms?
* Last check-up?
* Next appointment?

Then display simple guidance such as:

**“Your next scheduled check-up is due soon.”**

For emergency symptoms, clearly instruct the user to seek immediate professional medical care rather than providing a diagnosis.

---

# 14. NEARBY FACILITY FINDER

Create a page showing:

* PHC
* CHC
* Government hospital
* District hospital
* Registered/private healthcare facility

For prototype purposes, use demo locations.

Include:

* Facility name
* Type
* Distance placeholder
* Contact
* Open/closed placeholder
* Emergency indicator

Structure it so real map/location APIs can be added later.

---

# 15. EMERGENCY SUPPORT

Create an emergency page with:

**Emergency Help**

* Emergency contact
* Family/guardian contact
* Nearest healthcare facility
* Emergency instructions
* One-tap call buttons as prototype UI

Make this extremely simple and visible.

---

# 16. FAMILY / GUARDIAN ACCESS

Allow the patient to add:

* Husband/family member/guardian
* Name
* Relationship
* Phone number

Create consent-based limited access.

The family member should NOT automatically receive the complete medical record.

---

# 17. SECURE DOCUMENT VAULT + OCR

Create a secure document section.

Categories:

* Ultrasound
* Blood report
* Urine report
* Prescription
* Vaccination
* Other medical documents

Add an OCR prototype interface:

**Upload Document → Extract Text → Review → Save**

If actual OCR is not available, create the interface and backend structure for future OCR integration rather than pretending extraction occurred.

---

# 18. GOVERNMENT DASHBOARD

Create an admin/government-style dashboard showing only appropriate aggregated/demo information.

Show:

* Total registered pregnancies
* Active pregnancies
* High-risk cases
* Completed ANC visits
* Missed follow-ups
* Care gaps
* Healthcare facilities
* Healthcare workers
* Scheme-benefit tracking

Use charts and clean cards.

Do NOT expose unnecessary personally identifiable information on the government dashboard.

---

# 19. SCHEME BENEFIT TRACKER

Create a section where healthcare workers/admin can track whether the woman has received applicable maternal-health scheme benefits.

Use demo scheme names/statuses.

Statuses:

✓ Received
⏳ Pending
❌ Not received

Make this configurable so actual government schemes can be added later.

---

# 20. BILINGUAL SYSTEM — VERY IMPORTANT

The entire interface must support:

### English

and

### Hindi

Add a highly visible language toggle:

**EN | हिंदी**

When the user switches language, translate:

* Navigation
* Buttons
* Forms
* Dashboard labels
* Alerts
* Instructions
* Medical-record labels
* Reminders
* Patient guidance

Do not merely translate the homepage.

Use simple Hindi suitable for rural users.

Examples:

**Maternal Health ID → मातृ स्वास्थ्य पहचान संख्या**

**Medical Records → चिकित्सा रिकॉर्ड**

**Pregnancy Timeline → गर्भावस्था समयरेखा**

**High-Risk Alert → उच्च जोखिम चेतावनी**

**Healthcare Provider → स्वास्थ्य सेवा प्रदाता**

**Upload Report → रिपोर्ट अपलोड करें**

**My Records → मेरे रिकॉर्ड**

Keep medical terms understandable.

---

# 21. RURAL-FRIENDLY DESIGN

The UI must be:

* Very simple
* Large readable text
* Large buttons
* Minimal typing
* Clear icons
* High readability
* Mobile-first
* Fast and uncluttered
* Easy for first-time smartphone users

Use Hindi prominently when Hindi is selected.

Avoid overly complicated medical terminology.

---

# 22. VISUAL DESIGN

Make MAA Setu look like a **professional healthcare startup**, not a generic AI-generated website.

Brand:

**MAA Setu**

Use a warm healthcare visual identity with:

* Pink/magenta
* Purple
* White
* Soft gradients
* Subtle green accents

Use a clean modern typography system.

Add a logo inspired by:

**mother + baby + bridge/setu**

Do not make the website look childish.

Use:

* Rounded cards
* Clean shadows
* Modern icons
* Soft gradients
* Elegant healthcare illustrations
* Smooth but subtle animations
* Excellent spacing

The website must look polished enough for an **SIH presentation/demo**.

---

# 23. HOMEPAGE

Create an attractive landing page.

Hero section:

**MAA Setu**

**“जोड़ें सेहत, माँ और भविष्य”**

Subheading:

**One Maternal Health ID. One connected pregnancy journey.**

Explain:

> MAA Setu connects pregnant women, healthcare providers and verified maternal health records to support continuity of care throughout pregnancy.

Buttons:

**Get Started**

**Healthcare Provider Login**

**How It Works**

Show a visual flow:

**Woman → MHID → Medical Records → Doctor → Continuity of Care**

---

# 24. FEATURES SECTION

Show the 17 major features from the MAA Setu concept:

1. Unique Maternal Health ID
2. Digital Medical Records
3. Healthcare Connection
4. High-Risk Pregnancy Alerts
5. Pregnancy Risk Trend
6. Emergency Support
7. Rural-Friendly Design
8. Family/Guardian Access
9. Healthcare Worker Data Entry
10. Care Gap Tracker
11. “What Do I Do Now?”
12. Smart Reminders
13. Secure Document Vault + OCR
14. Government Dashboard
15. Scheme Benefit Tracker
16. Nearby Facility Finder
17. Postpartum & Newborn Care

Make **MHID + Digital Medical Records + Healthcare Connection** visually more prominent because they are the core innovation.

---

# 25. POSTPARTUM & NEWBORN CARE

After delivery, show:

* Postpartum check-up reminders
* Newborn vaccination reminders
* Maternal recovery follow-up
* Newborn basic record
* Follow-up appointments

Keep this as a secondary feature.

---

# 26. LOGIN SYSTEM

Create separate login options:

**Pregnant Woman**

**Doctor / Healthcare Worker**

**Hospital/Admin**

Use demo login credentials visibly on the prototype login page so judges can easily test the application.

Example:

Patient:

`patient@maasetu.demo`

Doctor 1:

`doctor1@maasetu.demo`

Doctor 2:

`doctor2@maasetu.demo`

Admin:

`admin@maasetu.demo`

Use secure authentication architecture and clearly label these as DEMO credentials.

---

# 27. DATABASE

Create proper relational data structures for:

* Users
* Patients
* Doctors
* Hospitals
* MHIDs
* Pregnancies
* Medical records
* Documents
* Appointments
* Consent records
* Risk assessments
* Alerts
* Reminders
* Vaccinations
* Scheme benefits
* Care gaps
* Family members
* Audit/access logs

Link everything through the patient's MHID/patient ID.

The pregnancy timeline must automatically update when a doctor adds a new medical record.

---

# 28. ACCESS CONTROL

Implement role-based access.

Patient:

Can view own records and manage consent.

Doctor:

Can access records only after appropriate authorization/consent.

Hospital/Admin:

Can manage appropriate operational information.

Every medical-record access should create an **access/audit log**.

Example:

> Dr. Neha Verma accessed Sita Devi's records
> Date: 12 Aug 2026
> Reason: Follow-up consultation

---

# 29. DEMO MODE

Create a clearly visible:

**DEMO MODE**

Use the complete Sita Devi pregnancy journey so judges can immediately experience the system.

Create a “Demo Journey” button that takes the user through:

1. Patient profile
2. MHID
3. Month 1–5 records by Doctor 1
4. Doctor change
5. Consent
6. Doctor 2 access
7. Month 6–9 records
8. Risk trend
9. Alerts
10. Complete pregnancy timeline

This should be the easiest way to demonstrate the project during SIH.

---

# 30. FINAL QUALITY REQUIREMENTS

The application must:

* Be fully responsive
* Work on mobile and desktop
* Have working navigation
* Have working forms
* Have working authentication
* Have working role-based dashboards
* Have working database connections
* Have working MHID generation
* Have working record creation
* Have working document upload
* Have working consent flow
* Have working pregnancy timeline
* Have working demo data
* Have working bilingual toggle
* Have functional prototype risk assessment
* Have realistic loading/error/empty states
* Have no broken buttons
* Have no placeholder lorem ipsum
* Have no unfinished pages
* Have consistent design throughout

Prioritize **functionality + demonstration of the MHID continuity-of-care workflow** over unnecessary decorative features.

Do not remove features because there are many. Implement simplified but functional versions where necessary.

At the end, provide a clear **Demo Login / Demo Journey** so a judge can test the application immediately.

The final product should feel like a real, polished healthcare technology prototype called **MAA Setu**, with the central message:

**“One Maternal Health ID. Complete pregnancy history. Continuity of care.”**
make a very attractive design so thet people love it go according to the theme

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://maa-setu.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0b5cb291-0d14-4f32-a9c9-9d64022cb15c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
