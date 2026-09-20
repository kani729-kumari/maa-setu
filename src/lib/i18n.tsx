import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "hi";

type Dict = Record<string, [string, string]>;

const dict: Dict = {
  brand: ["MAA Setu", "माँ सेतु"],
  tagline: ["जोड़ें सेहत, माँ और भविष्य", "जोड़ें सेहत, माँ और भविष्य"],
  heroSub: [
    "One Maternal Health ID. One connected pregnancy journey.",
    "एक मातृ स्वास्थ्य पहचान संख्या। एक जुड़ी हुई गर्भावस्था यात्रा।",
  ],
  heroBody: [
    "MAA Setu connects pregnant women, healthcare providers and verified maternal health records to support continuity of care throughout pregnancy.",
    "माँ सेतु गर्भवती महिलाओं, स्वास्थ्य सेवा प्रदाताओं और सत्यापित मातृ स्वास्थ्य रिकॉर्ड को जोड़ता है, जिससे पूरी गर्भावस्था में देखभाल की निरंतरता बनी रहे।",
  ],
  getStarted: ["Get Started", "शुरू करें"],
  providerLogin: ["Healthcare Provider Login", "स्वास्थ्य प्रदाता लॉगिन"],
  howItWorks: ["How It Works", "यह कैसे काम करता है"],
  demoMode: ["DEMO MODE", "डेमो मोड"],
  demoData: ["Prototype / Demo Data", "प्रोटोटाइप / डेमो डेटा"],
  demoJourney: ["Demo Journey", "डेमो यात्रा"],
  features: ["Features", "विशेषताएँ"],
  login: ["Login", "लॉगिन"],
  logout: ["Logout", "लॉग आउट"],
  email: ["Email", "ईमेल"],
  password: ["Password", "पासवर्ड"],
  signIn: ["Sign In", "साइन इन करें"],
  demoCreds: ["Demo Credentials", "डेमो लॉगिन जानकारी"],
  loginAs: ["Login as", "इस रूप में लॉगिन करें"],
  patient: ["Pregnant Woman / Patient", "गर्भवती महिला / मरीज़"],
  doctor: ["Doctor / Healthcare Worker", "डॉक्टर / स्वास्थ्य कार्यकर्ता"],
  admin: ["Hospital / Admin", "अस्पताल / प्रशासन"],
  mhid: ["Maternal Health ID", "मातृ स्वास्थ्य पहचान संख्या"],
  mhidCard: ["MHID Card", "एमएचआईडी कार्ड"],
  records: ["Medical Records", "चिकित्सा रिकॉर्ड"],
  myRecords: ["My Records", "मेरे रिकॉर्ड"],
  timeline: ["Pregnancy Timeline", "गर्भावस्था समयरेखा"],
  highRisk: ["High-Risk Alert", "उच्च जोखिम चेतावनी"],
  provider: ["Healthcare Provider", "स्वास्थ्य सेवा प्रदाता"],
  uploadReport: ["Upload Report", "रिपोर्ट अपलोड करें"],
  consent: ["Consent", "सहमति"],
  consentRequests: ["Consent Requests", "सहमति अनुरोध"],
  allowAccess: ["Allow Access", "पहुँच की अनुमति दें"],
  denyAccess: ["Deny Access", "पहुँच अस्वीकार करें"],
  revoke: ["Revoke", "अनुमति वापस लें"],
  granted: ["Granted", "स्वीकृत"],
  denied: ["Denied", "अस्वीकृत"],
  revoked: ["Revoked", "वापस ली गई"],
  pending: ["Pending", "लंबित"],
  completed: ["Completed", "पूर्ण"],
  attention: ["Attention required", "ध्यान देने की आवश्यकता"],
  reminders: ["Smart Reminders", "स्मार्ट अनुस्मारक"],
  appointments: ["Appointments", "अपॉइंटमेंट"],
  riskStatus: ["Risk Status", "जोखिम स्थिति"],
  riskAssessment: ["AI-Assisted Risk Assessment", "एआई-सहायित जोखिम आकलन"],
  riskLevel: ["Risk Level", "जोखिम स्तर"],
  low: ["Low", "कम"],
  moderate: ["Moderate", "मध्यम"],
  high: ["High", "उच्च"],
  riskDisclaimer: [
    "This prototype provides decision-support information and does not replace diagnosis or medical advice.",
    "यह प्रोटोटाइप निर्णय-सहायता जानकारी देता है और किसी निदान या चिकित्सकीय सलाह का विकल्प नहीं है।",
  ],
  careGaps: ["Care Gap Tracker", "देखभाल अंतर ट्रैकर"],
  vaccination: ["Vaccination", "टीकाकरण"],
  schemes: ["Scheme Benefits", "योजना लाभ"],
  emergency: ["Emergency Help", "आपातकालीन सहायता"],
  facilities: ["Nearby Facilities", "आसपास की स्वास्थ्य सुविधाएँ"],
  family: ["Family / Guardian Access", "परिवार / अभिभावक पहुँच"],
  documents: ["Document Vault", "दस्तावेज़ तिजोरी"],
  whatNow: ["What Do I Do Now?", "अब मुझे क्या करना है?"],
  accessLog: ["Access Log", "पहुँच रिकॉर्ड"],
  profile: ["Profile", "प्रोफ़ाइल"],
  overview: ["Overview", "अवलोकन"],
  dashboard: ["Dashboard", "डैशबोर्ड"],
  searchMhid: ["Search patient by MHID", "एमएचआईडी से मरीज़ खोजें"],
  search: ["Search", "खोजें"],
  registerPatient: ["Register New Pregnant Woman", "नई गर्भवती महिला का पंजीकरण"],
  addRecord: ["Add Medical Record", "चिकित्सा रिकॉर्ड जोड़ें"],
  save: ["Save", "सहेजें"],
  cancel: ["Cancel", "रद्द करें"],
  copy: ["Copy", "कॉपी करें"],
  print: ["Download / Print", "डाउनलोड / प्रिंट"],
  share: ["Share", "साझा करें"],
  copied: ["Copied", "कॉपी हो गया"],
  showAtFacility: [
    "Show this ID at authorized healthcare facilities",
    "इस पहचान संख्या को अधिकृत स्वास्थ्य केंद्रों पर दिखाएँ",
  ],
  emergencyContact: ["Emergency Contact", "आपातकालीन संपर्क"],
  registeredOn: ["Registered on", "पंजीकरण दिनांक"],
  month: ["Month", "महीना"],
  week: ["Week", "सप्ताह"],
  verified: ["Verified", "सत्यापित"],
  notes: ["Doctor Notes", "डॉक्टर की टिप्पणी"],
  recommendations: ["Recommendations", "सिफ़ारिशें"],
  noRecords: ["No records yet", "अभी कोई रिकॉर्ड नहीं"],
  loading: ["Loading…", "लोड हो रहा है…"],
  postpartum: ["Postpartum & Newborn Care", "प्रसवोत्तर एवं नवजात देखभाल"],
  govDashboard: ["Government Dashboard", "सरकारी डैशबोर्ड"],
  totalPregnancies: ["Total registered pregnancies", "कुल पंजीकृत गर्भधारण"],
  activePregnancies: ["Active pregnancies", "सक्रिय गर्भधारण"],
  highRiskCases: ["High-risk cases", "उच्च जोखिम मामले"],
  ancVisits: ["Completed ANC visits", "पूर्ण एएनसी विज़िट"],
  missedFollowups: ["Missed follow-ups", "छूटी हुई फ़ॉलो-अप"],
  doctors: ["Healthcare workers", "स्वास्थ्य कार्यकर्ता"],
  hospitals: ["Healthcare facilities", "स्वास्थ्य सुविधाएँ"],
  patients: ["Patients", "मरीज़"],
  consentRequired: ["Patient Consent Required", "मरीज़ की सहमति आवश्यक"],
  prevRecordsFound: [
    "Previous Verified Medical Records Found",
    "पिछले सत्यापित चिकित्सा रिकॉर्ड मिले",
  ],
  consentGranted: [
    "Consent Granted — previous verified records are now available to the authorized healthcare provider.",
    "सहमति स्वीकृत — पिछले सत्यापित रिकॉर्ड अब अधिकृत स्वास्थ्य प्रदाता को उपलब्ध हैं।",
  ],
  requestConsent: ["Request Patient Consent", "मरीज़ से सहमति माँगें"],
  waitingConsent: ["Waiting for patient consent…", "मरीज़ की सहमति की प्रतीक्षा…"],
  callNow: ["Call now", "अभी कॉल करें"],
  addFamily: ["Add family member", "परिवार का सदस्य जोड़ें"],
  name: ["Name", "नाम"],
  relationship: ["Relationship", "रिश्ता"],
  phone: ["Phone", "फ़ोन"],
  age: ["Age", "उम्र"],
  village: ["Village", "गाँव"],
  district: ["District", "ज़िला"],
  state: ["State", "राज्य"],
  bloodGroup: ["Blood group", "रक्त समूह"],
  edd: ["Expected delivery date", "संभावित प्रसव तिथि"],
  extractText: ["Extract Text (OCR)", "पाठ निकालें (ओसीआर)"],
  ocrNote: [
    "OCR integration is prepared in the backend; text extraction is not performed in this prototype.",
    "ओसीआर एकीकरण बैकएंड में तैयार है; इस प्रोटोटाइप में पाठ नहीं निकाला जाता।",
  ],
  seekCare: [
    "If you have severe symptoms, go to the nearest healthcare facility immediately or call for emergency help.",
    "यदि गंभीर लक्षण हैं तो तुरंत नज़दीकी स्वास्थ्य केंद्र जाएँ या आपातकालीन सहायता के लिए कॉल करें।",
  ],
  complaintForms: ["Complaint Forms", "शिकायत फ़ॉर्म"],
  govtComplaint: ["Government complaint form", "सरकारी शिकायत फ़ॉर्म"],
  hospitalComplaint: ["Hospital complaint form", "अस्पताल शिकायत फ़ॉर्म"],
  complaintNote: [
    "File an official complaint with the district health office or a partner hospital via Google Forms.",
    "Google फ़ॉर्म के माध्यम से ज़िला स्वास्थ्य कार्यालय या साझेदार अस्पताल में आधिकारिक शिकायत दर्ज करें।",
  ],
};

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const LangCtx = createContext<Ctx>({ lang: "en", setLang: () => {}, t: (k) => k });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("maasetu-lang");
    if (stored === "hi" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    window.localStorage.setItem("maasetu-lang", l);
  }, []);

  const t = useCallback(
    (key: string) => {
      const entry = dict[key];
      if (!entry) return key;
      return lang === "hi" ? entry[1] : entry[0];
    },
    [lang],
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);
  return <LangCtx.Provider value={value}>{children}</LangCtx.Provider>;
}

export function useI18n() {
  return useContext(LangCtx);
}
