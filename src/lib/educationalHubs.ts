/**
 * educationalHubs.ts
 * Comprehensive database of colleges, universities, exam centers,
 * and tech hubs mapped to their exact localities and nearby stay areas across Delhi NCR & India.
 */

export interface EducationalHub {
  id: string;
  name: string;
  shortName: string;
  locality: string;
  city: string;
  cityId: string;
  sub: string;
  badge: 'College' | 'University' | 'Coaching Hub' | 'Tech Hub';
  keywords: string[];
  queryValue: string;
  lat?: number;
  lon?: number;
}

export const EDUCATIONAL_HUBS: EducationalHub[] = [
  // ── GHAZIABAD & MODINAGAR (SRM, ABES, KIET, AKGEC, IMS) ──────────────
  {
    id: 'srm-ghaziabad',
    name: 'SRM Institute of Science & Technology (SRM University Delhi-NCR)',
    shortName: 'SRM University (Ghaziabad/NCR)',
    locality: 'Modinagar / Delhi-Meerut Expressway',
    city: 'Ghaziabad',
    cityId: 'ghaziabad',
    sub: 'Delhi-Meerut Road, Modinagar • Near Muradnagar, Raj Nagar Extension & Student Hostels',
    badge: 'University',
    keywords: [
      'srm', 'srm university', 'srm ghaziabad', 'srm modinagar', 'srm delhi ncr', 'srm ist',
      'srm campus', 'modinagar', 'muradnagar', 'srm college'
    ],
    queryValue: 'Ghaziabad',
    lat: 28.826,
    lon: 77.585,
  },
  {
    id: 'srm-sonepat',
    name: 'SRM University Delhi-NCR (Sonepat Campus)',
    shortName: 'SRM Sonepat',
    locality: 'Rajiv Gandhi Education City',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Rajiv Gandhi Education City • Near Kundli, Rai & North Delhi border stays',
    badge: 'University',
    keywords: ['srm', 'srm sonepat', 'srm university', 'srm delhi', 'education city', 'kundli', 'rai'],
    queryValue: 'Delhi',
    lat: 28.924,
    lon: 77.112,
  },
  {
    id: 'abes-ghaziabad',
    name: 'ABES Engineering College (ABES EC / ABES IT)',
    shortName: 'ABES College',
    locality: 'Crossings Republik / NH-24',
    city: 'Ghaziabad',
    cityId: 'ghaziabad',
    sub: 'NH-24 Expressway • Near Crossings Republik, Lal Kuan, Chipiyana & Sector 62 border',
    badge: 'College',
    keywords: ['abes', 'abes ec', 'abes it', 'abes ghaziabad', 'crossings republik', 'nh 24', 'lal kuan', 'chipiyana'],
    queryValue: 'Crossings Republik',
    lat: 28.636,
    lon: 77.447,
  },
  {
    id: 'kiet-ghaziabad',
    name: 'KIET Group of Institutions',
    shortName: 'KIET Ghaziabad',
    locality: 'Muradnagar / Meerut Road',
    city: 'Ghaziabad',
    cityId: 'ghaziabad',
    sub: 'Delhi-Meerut Road • Near Muradnagar, Duhai RapidX Metro Station & Raj Nagar Ext',
    badge: 'College',
    keywords: ['kiet', 'kiet ghaziabad', 'kiet group', 'muradnagar', 'duhai', 'meerut road'],
    queryValue: 'Ghaziabad',
    lat: 28.753,
    lon: 77.498,
  },
  {
    id: 'akgec-ghaziabad',
    name: 'Ajay Kumar Garg Engineering College (AKGEC)',
    shortName: 'AKGEC College',
    locality: 'Dasna / NH-24',
    city: 'Ghaziabad',
    cityId: 'ghaziabad',
    sub: '27th Km Stone, Delhi-Hapur Bypass • Near Wave City, Dasna & Govindpuram',
    badge: 'College',
    keywords: ['akgec', 'ajay kumar garg', 'akg', 'dasna', 'wave city', 'govindpuram', 'nh-24'],
    queryValue: 'Ghaziabad',
    lat: 28.675,
    lon: 77.502,
  },
  {
    id: 'ims-ghaziabad',
    name: 'IMS Ghaziabad (University Courses Campus)',
    shortName: 'IMS Ghaziabad',
    locality: 'Lal Quan / GT Road',
    city: 'Ghaziabad',
    cityId: 'ghaziabad',
    sub: 'GT Road / NH-24 • Near Lal Quan, Bulandshahr Road & Crossings Republik',
    badge: 'College',
    keywords: ['ims', 'ims ghaziabad', 'ims lal quan', 'gt road'],
    queryValue: 'Ghaziabad',
    lat: 28.647,
    lon: 77.465,
  },
  {
    id: 'rkgit-ghaziabad',
    name: 'Raj Kumar Goel Institute of Technology (RKGIT)',
    shortName: 'RKGIT College',
    locality: 'Raj Nagar Extension',
    city: 'Ghaziabad',
    cityId: 'ghaziabad',
    sub: '5 Km Stone, Delhi-Meerut Road • Near Raj Nagar Extension, Morta & River Heights',
    badge: 'College',
    keywords: ['rkgit', 'raj kumar goel', 'raj nagar extension', 'morta', 'meerut road'],
    queryValue: 'Raj Nagar Extension',
    lat: 28.718,
    lon: 77.447,
  },
  {
    id: 'indirapuram-gzb',
    name: 'Indirapuram & Shipra Sun City',
    shortName: 'Indirapuram Stays',
    locality: 'Indirapuram',
    city: 'Ghaziabad',
    cityId: 'ghaziabad',
    sub: 'Indirapuram • Near Shipra Mall, Habitat Centre, Vaishali Metro & NH-24',
    badge: 'Tech Hub',
    keywords: ['indirapuram', 'shipra', 'shipra mall', 'vaibhav khand', 'ahinsa khand', 'nyay khand'],
    queryValue: 'Indirapuram',
    lat: 28.638,
    lon: 77.375,
  },

  // ── NOIDA ─────────────────────────────────────────────────────────────
  {
    id: 'amity-noida',
    name: 'Amity University Noida',
    shortName: 'Amity University',
    locality: 'Sector 126',
    city: 'Noida',
    cityId: 'noida',
    sub: 'Sector 126 • Near Amity Gate 2, Sector 125, Sector 44 & Express Towers',
    badge: 'University',
    keywords: ['amity', 'amity university', 'amity noida', 'sector 126', 'sec 126', 'sector 125', 'expressway', 'raipur khadar'],
    queryValue: 'Sector 126',
    lat: 28.544,
    lon: 77.338,
  },
  {
    id: 'jss-noida',
    name: 'JSS Academy of Technical Education (JSSATE)',
    shortName: 'JSS Academy',
    locality: 'Sector 62',
    city: 'Noida',
    cityId: 'noida',
    sub: 'Sector 62 • Near Electronic City Metro, Model Town & Sector 63 IT Park',
    badge: 'College',
    keywords: ['jss', 'jssate', 'jss noida', 'jss academy', 'sector 62', 'sec 62', 'electronic city', 'mamura'],
    queryValue: 'Sector 62',
    lat: 28.628,
    lon: 77.362,
  },
  {
    id: 'jiit-noida',
    name: 'Jaypee Institute of Information Technology (JIIT)',
    shortName: 'JIIT Jaypee',
    locality: 'Sector 62',
    city: 'Noida',
    cityId: 'noida',
    sub: 'Sector 62 & 128 • Near Fortis, Electronic City & Jaypee Wish Town',
    badge: 'University',
    keywords: ['jaypee', 'jiit', 'jaypee noida', 'jiit 62', 'jiit 128', 'sector 62', 'sector 128', 'wish town'],
    queryValue: 'Sector 62',
    lat: 28.630,
    lon: 77.370,
  },
  {
    id: 'ims-noida',
    name: 'IMS Noida (Institute of Management Studies)',
    shortName: 'IMS Noida',
    locality: 'Sector 62',
    city: 'Noida',
    cityId: 'noida',
    sub: 'Sector 62 • Walking distance to Metro & Sector 63 Corporate Hub',
    badge: 'College',
    keywords: ['ims', 'ims noida', 'sector 62', 'sec 62'],
    queryValue: 'Sector 62',
    lat: 28.627,
    lon: 77.365,
  },
  {
    id: 'advant-navis-noida',
    name: 'Advant Navis & Tech Zone',
    shortName: 'Advant Navis Hub',
    locality: 'Sector 137',
    city: 'Noida',
    cityId: 'noida',
    sub: 'Sector 137 • Near Sector 142 Metro, Felix Hospital & Paras Tierea',
    badge: 'Tech Hub',
    keywords: ['advant', 'advant navis', 'sector 137', 'sec 137', 'sector 142', 'paras tierea', 'felix'],
    queryValue: 'Sector 137',
    lat: 28.513,
    lon: 77.404,
  },

  // ── GREATER NOIDA ─────────────────────────────────────────────────────
  {
    id: 'sharda-univ',
    name: 'Sharda University',
    shortName: 'Sharda University',
    locality: 'Knowledge Park III',
    city: 'Greater Noida',
    cityId: 'greater-noida',
    sub: 'Knowledge Park III • Near Pari Chowk, Sharda Hospital & Delta Sectors',
    badge: 'University',
    keywords: ['sharda', 'sharda university', 'knowledge park', 'knowledge park 3', 'pari chowk', 'sharda hospital'],
    queryValue: 'Knowledge Park',
    lat: 28.473,
    lon: 77.483,
  },
  {
    id: 'galgotias-univ',
    name: 'Galgotias University & College (GCET)',
    shortName: 'Galgotias Campus',
    locality: 'Knowledge Park II',
    city: 'Greater Noida',
    cityId: 'greater-noida',
    sub: 'Knowledge Park II & Yamuna Expressway • Near Pari Chowk & India Expo Mart',
    badge: 'University',
    keywords: ['galgotias', 'galgotia', 'gcet', 'galgotias university', 'knowledge park 2', 'pari chowk'],
    queryValue: 'Knowledge Park',
    lat: 28.468,
    lon: 77.492,
  },
  {
    id: 'gl-bajaj',
    name: 'GL Bajaj Institute of Technology & Management',
    shortName: 'GL Bajaj',
    locality: 'Knowledge Park II',
    city: 'Greater Noida',
    cityId: 'greater-noida',
    sub: 'Knowledge Park II • Next to Pari Chowk, Sharda & Knowledge Park Metro',
    badge: 'College',
    keywords: ['gl bajaj', 'g.l. bajaj', 'gl bajaj noida', 'knowledge park 2', 'pari chowk'],
    queryValue: 'Knowledge Park',
    lat: 28.465,
    lon: 77.490,
  },
  {
    id: 'bennett-univ',
    name: 'Bennett University (Times Group)',
    shortName: 'Bennett University',
    locality: 'TechZone 2',
    city: 'Greater Noida',
    cityId: 'greater-noida',
    sub: 'TechZone 2 • Near Pari Chowk, Delta 2, Surajpur & Knowledge Corridor',
    badge: 'University',
    keywords: ['bennett', 'bennett university', 'times group', 'techzone', 'tech zone 2', 'greater noida'],
    queryValue: 'Greater Noida',
    lat: 28.452,
    lon: 77.584,
  },
  {
    id: 'gbu-greaternoida',
    name: 'Gautam Buddha University (GBU)',
    shortName: 'GBU Campus',
    locality: 'Yamuna Expressway',
    city: 'Greater Noida',
    cityId: 'greater-noida',
    sub: 'Yamuna Expressway • 511-acre campus near Sector Chi & Pari Chowk',
    badge: 'University',
    keywords: ['gbu', 'gautam buddha university', 'yamuna expressway', 'pari chowk', 'sector chi'],
    queryValue: 'Greater Noida',
    lat: 28.423,
    lon: 77.525,
  },
  {
    id: 'niu-greaternoida',
    name: 'Noida International University (NIU)',
    shortName: 'NIU Campus',
    locality: 'Sector 17A, Yamuna Expressway',
    city: 'Greater Noida',
    cityId: 'greater-noida',
    sub: 'Yamuna Expressway • Opposite Formula 1 Track, Near Galgotias University',
    badge: 'University',
    keywords: ['niu', 'noida international university', 'yamuna expressway', 'sector 17a'],
    queryValue: 'Greater Noida',
    lat: 28.368,
    lon: 77.538,
  },
  {
    id: 'shiv-nadar-univ',
    name: 'Shiv Nadar University (SNU)',
    shortName: 'Shiv Nadar (SNU)',
    locality: 'Dadri Corridor',
    city: 'Greater Noida',
    cityId: 'greater-noida',
    sub: 'NH-91, Tehsil Dadri • Greater Noida East residential corridor',
    badge: 'University',
    keywords: ['snu', 'shiv nadar', 'shiv nadar university', 'dadri'],
    queryValue: 'Greater Noida',
    lat: 28.526,
    lon: 77.575,
  },

  // ── DELHI (DU, IIT, AIIMS, JNU, JAMIA, DTU, NSUT, IIIT, IPU, COACHING) ─
  {
    id: 'du-north-campus',
    name: 'Delhi University — DU North Campus',
    shortName: 'DU North Campus',
    locality: 'North Campus (GTB Nagar)',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'North Campus • Near SRCC, Hindu, Hansraj, Miranda House, KMC & Hudson Lane',
    badge: 'University',
    keywords: [
      'du', 'delhi university', 'north campus', 'gtb nagar', 'srcc', 'hindu college',
      'hansraj', 'miranda house', 'kirori mal', 'ramjas', 'stephens', 'vishwavidyalaya',
      'kamla nagar', 'hudson lane', 'faculty of law', 'vijay nagar', 'malka ganj'
    ],
    queryValue: 'North Campus',
    lat: 28.690,
    lon: 77.207,
  },
  {
    id: 'du-south-campus',
    name: 'Delhi University — DU South Campus',
    shortName: 'DU South Campus',
    locality: 'South Campus (Satya Niketan)',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Satya Niketan • Near Venky, LSR, Gargi, Maitreyi, ARSD & Dhaula Kuan',
    badge: 'University',
    keywords: [
      'du', 'south campus', 'satya niketan', 'venky', 'sri venkateswara', 'gargi',
      'maitreyi', 'arsd', 'motilal nehru', 'jmc', 'dhaula kuan', 'moti bagh', 'lsr'
    ],
    queryValue: 'South Campus',
    lat: 28.587,
    lon: 77.165,
  },
  {
    id: 'iit-delhi',
    name: 'IIT Delhi (Indian Institute of Technology)',
    shortName: 'IIT Delhi',
    locality: 'Hauz Khas',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Hauz Khas • Near Jia Sarai, Kalu Sarai, Ber Sarai & Green Park Metro',
    badge: 'University',
    keywords: ['iit', 'iit delhi', 'iitd', 'hauz khas', 'jia sarai', 'kalu sarai', 'ber sarai', 'green park'],
    queryValue: 'Hauz Khas',
    lat: 28.545,
    lon: 77.193,
  },
  {
    id: 'aiims-delhi',
    name: 'AIIMS New Delhi (All India Institute of Medical Sciences)',
    shortName: 'AIIMS Delhi',
    locality: 'Ansari Nagar / Safdarjung',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Ansari Nagar • Near Safdarjung Hospital, Gautam Nagar, South Extension & AIIMS Metro',
    badge: 'College',
    keywords: ['aiims', 'aiims delhi', 'safdarjung', 'ansari nagar', 'gautam nagar', 'south extension'],
    queryValue: 'Safdarjung',
    lat: 28.567,
    lon: 77.210,
  },
  {
    id: 'jnu-delhi',
    name: 'Jawaharlal Nehru University (JNU)',
    shortName: 'JNU Delhi',
    locality: 'Munirka / Vasant Kunj',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'New Mehrauli Road • Near Munirka, Ber Sarai, Kishangarh & Vasant Kunj',
    badge: 'University',
    keywords: ['jnu', 'jawaharlal nehru university', 'munirka', 'vasant kunj', 'ber sarai', 'kishangarh'],
    queryValue: 'Munirka',
    lat: 28.539,
    lon: 77.166,
  },
  {
    id: 'jamia-delhi',
    name: 'Jamia Millia Islamia (JMI)',
    shortName: 'Jamia Campus',
    locality: 'Jamia Nagar / Okhla',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Jamia Nagar • Near Okhla, Batla House, Jasola, Zakir Nagar & Metro',
    badge: 'University',
    keywords: ['jamia', 'jamia millia islamia', 'jmi', 'jamia nagar', 'okhla', 'batla house', 'jasola'],
    queryValue: 'Okhla',
    lat: 28.562,
    lon: 77.280,
  },
  {
    id: 'dtu-delhi',
    name: 'Delhi Technological University (DTU / DCE)',
    shortName: 'DTU (DCE)',
    locality: 'Rohini / Bawana',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Shahbad Daulatpur, Main Bawana Road • Near Sector 17 Rohini & Samaypur Badli',
    badge: 'University',
    keywords: ['dtu', 'dce', 'delhi technological university', 'delhi college of engineering', 'rohini', 'bawana'],
    queryValue: 'Rohini',
    lat: 28.750,
    lon: 77.118,
  },
  {
    id: 'nsut-delhi',
    name: 'Netaji Subhas University of Technology (NSUT / NSIT)',
    shortName: 'NSUT Dwarka',
    locality: 'Dwarka Sector 3',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Azad Hind Fauj Marg • Near Sector 3 Dwarka, Dwarka Mor & Uttam Nagar',
    badge: 'University',
    keywords: ['nsut', 'nsit', 'netaji subhas', 'dwarka', 'sector 3 dwarka', 'dwarka mor'],
    queryValue: 'Dwarka',
    lat: 28.610,
    lon: 77.038,
  },
  {
    id: 'iiit-delhi',
    name: 'Indraprastha Institute of Information Technology (IIIT Delhi)',
    shortName: 'IIIT Delhi',
    locality: 'Okhla Phase III',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Okhla Industrial Estate Phase III • Near Govindpuri Metro, Kalkaji & Harkesh Nagar',
    badge: 'University',
    keywords: ['iiit', 'iiit delhi', 'iiitd', 'okhla', 'govindpuri', 'kalkaji'],
    queryValue: 'Okhla',
    lat: 28.545,
    lon: 77.273,
  },
  {
    id: 'ipu-delhi',
    name: 'Guru Gobind Singh Indraprastha University (IP University)',
    shortName: 'IP University (GGSIPU)',
    locality: 'Dwarka Sector 16C',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Dwarka Sector 16C • Main Campus, Near Dwarka Sector 14 Metro & Kakrola',
    badge: 'University',
    keywords: ['ipu', 'ggsipu', 'ip university', 'indraprastha university', 'dwarka sector 16', 'vips', 'mait'],
    queryValue: 'Dwarka',
    lat: 28.595,
    lon: 77.019,
  },
  {
    id: 'upsc-mukherjee-nagar',
    name: 'Mukherjee Nagar UPSC Coaching Hub',
    shortName: 'Mukherjee Nagar (UPSC)',
    locality: 'Mukherjee Nagar',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Mukherjee Nagar • Near Batra Cinema, Nehru Vihar, Drishti IAS & Vajiram',
    badge: 'Coaching Hub',
    keywords: ['mukherjee nagar', 'drishti ias', 'vajiram', 'upsc', 'batra', 'nehru vihar', 'gandhi vihar', 'ssc coaching'],
    queryValue: 'Mukherjee Nagar',
    lat: 28.710,
    lon: 77.215,
  },
  {
    id: 'karol-bagh-orn',
    name: 'Karol Bagh & Old Rajinder Nagar (ORN)',
    shortName: 'Karol Bagh / ORN',
    locality: 'Karol Bagh & Rajendra Nagar',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Karol Bagh • Near Vision IAS, Next IAS, Vajiram, Pusa Road & Rajendra Place',
    badge: 'Coaching Hub',
    keywords: ['karol bagh', 'old rajinder nagar', 'orn', 'rajendra nagar', 'vision ias', 'next ias', 'vajiram', 'pusa road'],
    queryValue: 'Karol Bagh',
    lat: 28.648,
    lon: 77.190,
  },
  {
    id: 'laxmi-nagar-ca',
    name: 'Laxmi Nagar CA & Commerce Hub',
    shortName: 'Laxmi Nagar (CA Hub)',
    locality: 'Laxmi Nagar',
    city: 'Delhi',
    cityId: 'delhi',
    sub: 'Laxmi Nagar • Near Shakarpur, Nirman Vihar Metro, Preet Vihar & ICAI Coaching',
    badge: 'Coaching Hub',
    keywords: ['laxmi nagar', 'shakarpur', 'nirman vihar', 'ca coaching', 'cs coaching', 'icai', 'commerce'],
    queryValue: 'Laxmi Nagar',
    lat: 28.631,
    lon: 77.277,
  },

  // ── GURUGRAM (CYBER CITY, GD GOENKA, KR MANGALAM, NCU) ────────────────
  {
    id: 'cyber-city-ggn',
    name: 'DLF Cyber City & Cyber Hub',
    shortName: 'Cyber City Hub',
    locality: 'Cyber City & DLF Phase 3',
    city: 'Gurugram',
    cityId: 'gurugram',
    sub: 'DLF Phase 3 • Near Rapid Metro, IndusInd Bank Cyber City, Gateway Tower & MNCs',
    badge: 'Tech Hub',
    keywords: ['cyber city', 'cyber hub', 'dlf', 'dlf phase 3', 'dlf phase 2', 'gurugram', 'gurgaon', 'rapid metro'],
    queryValue: 'Cyber City',
    lat: 28.495,
    lon: 77.089,
  },
  {
    id: 'gd-goenka-ggn',
    name: 'GD Goenka University & KR Mangalam',
    shortName: 'GD Goenka / KR Mangalam',
    locality: 'Sohna Road Corridor',
    city: 'Gurugram',
    cityId: 'gurugram',
    sub: 'Sohna Road Education City • Near Subhash Chowk, Badshahpur & Student Residencies',
    badge: 'University',
    keywords: ['gd goenka', 'kr mangalam', 'sohna road', 'gurugram university', 'badshahpur'],
    queryValue: 'Gurugram',
    lat: 28.328,
    lon: 77.075,
  },

  // ── PRAYAGRAJ & KOTA ──────────────────────────────────────────────────
  {
    id: 'au-prayagraj',
    name: 'University of Allahabad (Arts & Science)',
    shortName: 'Allahabad University (AU)',
    locality: 'Katra',
    city: 'Prayagraj',
    cityId: 'prayagraj',
    sub: 'Katra • Near University Road, Mumfordganj & Central Library',
    badge: 'University',
    keywords: ['au', 'allahabad university', 'university of allahabad', 'katra', 'anand bhawan', 'prayagraj university'],
    queryValue: 'Katra',
    lat: 25.460,
    lon: 75.850,
  },
  {
    id: 'mnnit-prayagraj',
    name: 'MNNIT Allahabad (NIT Prayagraj)',
    shortName: 'MNNIT Allahabad',
    locality: 'Teliyarganj',
    city: 'Prayagraj',
    cityId: 'prayagraj',
    sub: 'Teliyarganj • Near Govindpur, Rasulabad & Ganga Gate',
    badge: 'College',
    keywords: ['mnnit', 'mnnit allahabad', 'nit allahabad', 'teliyarganj', 'teliarganj'],
    queryValue: 'Teliyarganj',
    lat: 25.492,
    lon: 75.865,
  },
  {
    id: 'kota-coaching',
    name: 'Kota Coaching Hub (Allen, Resonance, Motion)',
    shortName: 'Landmark City (Kota)',
    locality: 'Kunhari / Landmark City',
    city: 'Kota',
    cityId: 'kota',
    sub: 'Landmark City • Near Allen SAMYAK, Sangyan, Talwandi & Rajiv Gandhi Nagar',
    badge: 'Coaching Hub',
    keywords: ['allen', 'kota', 'resonance', 'motion', 'landmark city', 'kunhari', 'talwandi', 'jee', 'neet'],
    queryValue: 'Kunhari',
    lat: 25.215,
    lon: 75.830,
  },
];

/**
 * Searches educational hubs with fuzzy prefix, word-boundary, and acronym matching
 */
export function searchEducationalHubs(query: string, limit = 8): EducationalHub[] {
  const rawQ = query.trim().toLowerCase();
  if (!rawQ) return EDUCATIONAL_HUBS.slice(0, limit);

  // Normalize query: remove punctuation and extra spaces
  const q = rawQ.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

  const results: { hub: EducationalHub; score: number }[] = [];

  for (const hub of EDUCATIONAL_HUBS) {
    let score = 0;
    const nameLower = hub.name.toLowerCase();
    const shortLower = hub.shortName.toLowerCase();
    const locLower = hub.locality.toLowerCase();
    const cityLower = hub.city.toLowerCase();

    // 1. Direct exact keyword match (highest priority, e.g. "srm", "du", "jss", "amity")
    if (hub.keywords.some((k) => k.toLowerCase() === q)) {
      score += 100;
    }

    // 2. Exact match in acronym or short name
    if (shortLower === q || shortLower.startsWith(q + ' ')) {
      score += 80;
    }

    // 3. Keyword starts with query or query starts with keyword
    if (hub.keywords.some((k) => k.startsWith(q) || q.startsWith(k))) {
      score += 60;
    }

    // 4. Name contains query
    if (nameLower.includes(q)) {
      score += 50;
    }

    // 5. Short name contains query
    if (shortLower.includes(q)) {
      score += 45;
    }

    // 6. Locality or city contains query
    if (locLower.includes(q) || cityLower.includes(q)) {
      score += 40;
    }

    // 7. Sub text contains query
    if (hub.sub.toLowerCase().includes(q)) {
      score += 20;
    }

    // 8. Word-by-word token matching
    const tokens = q.split(' ').filter((t) => t.length > 1);
    const matchedTokens = tokens.filter((t) =>
      nameLower.includes(t) ||
      shortLower.includes(t) ||
      locLower.includes(t) ||
      hub.keywords.some((k) => k.includes(t))
    );
    if (matchedTokens.length === tokens.length && tokens.length > 0) {
      score += 30 * matchedTokens.length;
    }

    if (score > 0) {
      results.push({ hub, score });
    }
  }

  // Sort descending by relevance score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, limit).map((r) => r.hub);
}
